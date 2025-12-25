import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ILogger, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, filter, firstValueFrom, Observable, Subject, take } from 'rxjs';
import { AuthService } from './auth.service';
import { EndpointFactoryService } from './endpoint-factory.service';
import { UnreadMessageService } from './unread-message.service';

class CustomSignalRLogger implements ILogger {
  log(logLevel: LogLevel, message: string): void {}
}

@Injectable({
  providedIn: 'root',
})
export class SignalRService extends EndpointFactoryService {

  private unreadMessageService = inject(UnreadMessageService)
  authService: AuthService = inject(AuthService);
  
  // Subjects for Components to subscribe to
  private messageReceived = new Subject<any>();
  private messageSentConfirm = new Subject<any>();
  private userStatusChanged = new Subject<{ chatId: string, isOnline: boolean, lastSeen?: string }>();
  private typingStatus = new Subject<{ conversationId: string, senderChatId: string }>();
  private unreadCountUpdate = new Subject<number>();
  private messagesMarkedAsRead = new Subject<any>();
  private messagesMarkedAsDelivered = new Subject<{ id: string, deliveredTime: Date }[]>();
  private updateUserListSource = new Subject<{ conversation: any, lastMessageSnippet: string, unreadCount: number }>();
  
  timerId: any = null;
  
  // Check if the Hub is Already Connected or is Connecting
  isConnected = false;
  isConnecting = false;
  private isListenersSet = false;
  hubConnection!: signalR.HubConnection;
  private connectionStarted$ = new BehaviorSubject<boolean>(false);

  // Hub URL on the Back-End
  private readonly url = this.configurations.baseUrl + '/chat';
  private option: signalR.IHttpConnectionOptions = {
    // Getting the Acces Token for Authentication and Authorization
    accessTokenFactory: () => this.accessToken,
  };

  // init() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(this.url, this.option)
  //     .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
  //     .configureLogging(new CustomSignalRLogger())
  //     .build();
  //   this.addListeners();
  // }

  // Initial Handshake
  init() {
    if(this.hubConnection) return;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url, {
        ...this.option,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true 
      })
      .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
      .configureLogging(new CustomSignalRLogger())
      .build();

    this.addListeners();
  }

  // External Observables
  onMessageReceived() { return this.messageReceived.asObservable(); }
  onSentConfirmation() { return this.messageSentConfirm.asObservable(); }
  onUserStatusChange() { return this.userStatusChanged.asObservable(); }
  onTyping() { return this.typingStatus.asObservable(); }
  onUnreadCountChange() { return this.unreadCountUpdate.asObservable(); }
  onMarkAsRead() { return this.messagesMarkedAsRead.asObservable(); } 
  onMarkAsDelivered() { return this.messagesMarkedAsDelivered.asObservable(); } 
  onUpdateUserList() { return this.updateUserListSource.asObservable(); }

  // Connecitng to the SignalR-Hub
  connect() {
    if (this.isConnected || !this.hubConnection) {
      return;
    }
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.isConnected = true;
      })
      .catch((err) => {
        console.error('SignalR Connection Error:', err);
        this.isConnected = false;
      });
  }

  // async connect(): Promise<void> {
  //   if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

  //   try {
  //     await this.hubConnection.start();
  //     console.log('SignalR Connected Successfully');
  //     this.connectionStarted$.next(true); // TURN ON THE GREEN LIGHT
  //   } catch (err) {
  //     console.error('SignalR Connection Error:', err);
  //     this.connectionStarted$.next(false);
  //     throw err;
  //   }
  // }

  //Ensures we never send data while disconnected
  public async waitForConnection(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    await firstValueFrom(
      this.connectionStarted$.pipe(
        filter(started => started === true),
        take(1)
      )
    );
  }  

  // Disconnecting from the SignalR-Hub
  disconnect() {
    this.isListenersSet = false;
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => {
          this.isConnected = false;
          console.log('SignalR disconnected successfully');
        })
        .catch((err) => {
          console.error('Error disconnecting SignalR:', err);
          this.isConnected = false;
        });
    } else {
      this.isConnected = false;
    }
  }

  // Check If User is Online
  public onCheckOnline() {
    return new Observable<any[]>(subscriber => {
      this.hubConnection?.on('CheckOnline', (statuses: any[]) => {
        subscriber.next(statuses);
      });
    });
  }  

  // Method to Join a Conversation
  async joinConversation(conversationId: string) {
    if (this.isConnected) {
      await this.hubConnection.send('JoinConversation', conversationId);
    }
  }

  // Method to Exit a Conversation
  async leaveConversation(conversationId: string) {
    if (this.isConnected) {
      await this.hubConnection.send('LeaveConversation', conversationId);
    }
  }

  // Send Message to the server to Send it to the Receiver in Real-Time
  async sendMessage(conversationId: string, receiverChatId: string, content: string) {
    if (!this.hubConnection) {
      this.init();
    }
    await this.waitForConnection();
    return await this.hubConnection.send('SendMessageToUser', conversationId, receiverChatId, content);
  }

  // Send Typing Notification to Server when Typing in a conversation
  async sendTypingNotification(conversationId: string) {
    return this.hubConnection.send('Typing', conversationId);
  }

  // Send Message to Server to Mark All the Messages in a conversation as Read
  async markConversationAsRead(conversationId: string) {
    if (!this.hubConnection) {
      this.init();
    }
    await this.waitForConnection();
    if (this.isConnected) {
      return await this.hubConnection.send('MarkAsRead', conversationId);
    } else console.log('Mark Conversation as read was called before hub was connected');
  }

  // Check The Online Status of all the Users and get a List of all the Online Users
  async checkOnlineStatus(chatIds: string[]) {
    if (this.isConnected) {
      return await this.hubConnection.send('CheckOnline', chatIds);
    } else { console.log('fail') }
  }  

  // Add All The Listeners for the hub to Listen to
  addListeners() {
    if (this.isListenersSet || !this.hubConnection) {
      return;
    }
    this.isListenersSet = true;

    // Online/Offline status changes
    this.hubConnection.on('IsOnline', (status) => {
      this.userStatusChanged.next(status);
    });

    // Bulk check online result
    this.hubConnection.on('CheckOnline', (statuses: any[]) => {
      statuses.forEach(s => this.userStatusChanged.next(s));
    });

    // Message Received Confirmation
    this.hubConnection.on('MarkAsReceivedBatch', (messages: any[]) => {
        this.messagesMarkedAsDelivered.next(messages);
    });

    // Receiving a New Message
    this.hubConnection.on('ReceiveMessage', (conversationId, message, senderChatId, messageId) => {
      this.messageReceived.next({ conversationId, message, senderChatId, messageId });
    });

    // Confirmation that Your Message Hit the Server
    this.hubConnection.on('SentMessage', (conversationId, message, messageId) => {
      this.messageSentConfirm.next({ conversationId, message, messageId });
    });

    // Global Unread Count update
    this.hubConnection.on('UnreadMessagesCount', (count: number) => {
      // Update the Unread Message Count in Real-time in Unread Message Service
      this.unreadMessageService.updateCount(count);
    });

    // Typing Indicator
    this.hubConnection.on('IsTyping', (conversationId, senderChatId) => {
      this.typingStatus.next({ conversationId, senderChatId });
    });

    // Marks as ead
    this.hubConnection.on('MarkAsRead', (conversationId, messages) => {
        console.log("Read Signal Received!", messages);
        this.messagesMarkedAsRead.next({ conversationId, messages });
    });

    // Update the Conversation List and bring it to the Top
    this.hubConnection.on('UpdateUserList', (conversation, lastMessageSnippet, unreadCount) => {
    // This updates the sidebar logic
        this.updateUserListSource.next({conversation, lastMessageSnippet, unreadCount});
    });

    // Closing the SignalR Connection
    this.hubConnection.onclose(() => {
      this.isConnected = false;
      console.log('SignalR Connection Closed');
    });
  }
}