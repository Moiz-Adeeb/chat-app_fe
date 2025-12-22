import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ILogger, LogLevel } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { EndpointFactoryService } from './endpoint-factory.service';

class CustomSignalRLogger implements ILogger {
  log(logLevel: LogLevel, message: string): void {}
}

@Injectable({
  providedIn: 'root',
})
export class SignalRService extends EndpointFactoryService {

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
  isConnected = false;
  isConnecting = false;
  authService: AuthService = inject(AuthService);
  private isListenersSet = false;
  hubConnection!: signalR.HubConnection;
  private newNotification = new Subject<{ title: string; message: string }>();
  private readonly url = this.configurations.baseUrl + '/chat';
  private option: signalR.IHttpConnectionOptions = {
    accessTokenFactory: () => this.accessToken,
  };

  getNewNotificationEvent(): Observable<{ title: string; message: string }> {
    return this.newNotification.asObservable();
  }

  // init() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(this.url, this.option)
  //     .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
  //     .configureLogging(new CustomSignalRLogger())
  //     .build();
  //   this.addListeners();
  // }

  init() {
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

  // --- External Observables ---
  onMessageReceived() { return this.messageReceived.asObservable(); }
  onSentConfirmation() { return this.messageSentConfirm.asObservable(); }
  onUserStatusChange() { return this.userStatusChanged.asObservable(); }
  onTyping() { return this.typingStatus.asObservable(); }
  onUnreadCountChange() { return this.unreadCountUpdate.asObservable(); }
  onMarkAsRead() { return this.messagesMarkedAsRead.asObservable(); } 
  onMarkAsDelivered() { return this.messagesMarkedAsDelivered.asObservable(); } 
  onUpdateUserList() { return this.updateUserListSource.asObservable(); }

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

  public onCheckOnline() {
    return new Observable<any[]>(subscriber => {
      this.hubConnection?.on('CheckOnline', (statuses: any[]) => {
        subscriber.next(statuses);
      });
    });
  }  

  async joinConversation(conversationId: string) {
    if (this.isConnected) {
      await this.hubConnection.send('JoinConversation', conversationId);
    }
  }

  async leaveConversation(conversationId: string) {
    if (this.isConnected) {
      await this.hubConnection.send('LeaveConversation', conversationId);
    }
  }

  async sendMessage(conversationId: string, receiverChatId: string, content: string) {
    return this.hubConnection.send('SendMessageToUser', conversationId, receiverChatId, content);
  }

  async sendTypingNotification(conversationId: string) {
    return this.hubConnection.send('Typing', conversationId);
  }

  async markConversationAsRead(conversationId: string) {
    return this.hubConnection.send('MarkAsRead', conversationId);
  }

  async checkOnlineStatus(chatIds: string[]) {
    return this.hubConnection.send('CheckOnline', chatIds);
  }  

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

    // Message received Confirmation
    this.hubConnection.on('MarkAsReceivedBatch', (messages: any[]) => {
        this.messagesMarkedAsDelivered.next(messages);
    });

    // Receiving a new message
    this.hubConnection.on('ReceiveMessage', (conversationId, message, senderChatId, messageId) => {
      this.messageReceived.next({ conversationId, message, senderChatId, messageId });
    });

    // Confirmation that your message hit the server
    this.hubConnection.on('SentMessage', (conversationId, message, messageId) => {
      this.messageSentConfirm.next({ conversationId, message, messageId });
    });

    // Global unread count update
    this.hubConnection.on('UnreadMessagesCount', (count: number) => {
      this.unreadCountUpdate.next(count);
    });

    // Typing indicator
    this.hubConnection.on('IsTyping', (conversationId, senderChatId) => {
      this.typingStatus.next({ conversationId, senderChatId });
    });

    // Marks as read
    this.hubConnection.on('MarkAsRead', (conversationId, messages) => {
        console.log("Read Signal Received!", messages);
        this.messagesMarkedAsRead.next({ conversationId, messages });
    });

    this.hubConnection.on('UpdateUserList', (conversation, lastMessageSnippet, unreadCount) => {
    // This updates the sidebar logic
        this.updateUserListSource.next({conversation, lastMessageSnippet, unreadCount});
    });

    this.hubConnection.onclose(() => {
      this.isConnected = false;
      console.log('SignalR Connection Closed');
    });
  }
}
