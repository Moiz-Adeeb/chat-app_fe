import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessagesClient, MessagesDto, MessageStatus } from '../api/api';
import { SignalRService } from './signal-r.service';

@Injectable({ providedIn: 'root' })
export class MessageService {

  // Injecting Messages and SignalRService for Later Use for API and Websocket Call
  private messageClient = inject(MessagesClient);
  private signalR = inject(SignalRService);

  // Getting the Enum for MessageStatus
  // Sent = 0
  // Delivered = 1
  // Read = 2
  protected readonly MessageStatus = MessageStatus

  // Storing the current Conversation ID
  private currentConversationIdSource = new BehaviorSubject<string | null>(null);
  public currentConversationId$ = this.currentConversationIdSource.asObservable();
  public currentConversationId: string | null = null;
  
  // This holds the messages for the currently active chat window
  private messagesSource = new BehaviorSubject<MessagesDto[]>([]);
  public messages$ = this.messagesSource.asObservable();

  // Checking if the Messages List is curently Loading or has been Completely Loaded
  private isLoadingSource = new BehaviorSubject<boolean>(false);
  public isLoadingMore$ = this.isLoadingSource.asObservable();
  private fullListLoadedSource = new BehaviorSubject<boolean>(false);
  public isFullListLoaded$ = this.fullListLoadedSource.asObservable();

  // Checking if the User is Typing
  private typingUsers = new BehaviorSubject<string[]>([]); 
  public typingUsers$ = this.typingUsers.asObservable();
  private typingTimers = new Map<string, any>();

  // Hash-Set of Messages ID's
  private messageIdSet = new Set<string>();

  constructor() {
    // Listen to all the SignalRService Methods
    this.listenToSignals();
  }

  // Function to Initially Load the Recent Messages of the Conversation
  loadChatHistory(chatId: string, page: number, pageSize: number) {
    // Set the Current Conversation in the Service
    this.currentConversationId = chatId;
    this.currentConversationIdSource.next(chatId);

    // Clear the Hash-Set and List of Previous Messages if Left any so no Mixing of Messages of Different Conversations
    this.messageIdSet.clear(); 
    this.fullListLoadedSource.next(false);
    this.messagesSource.next([]);

    // API CALL
    this.messageClient.getMessages(
      chatId,
      false,
      null,
      true,
      page,
      pageSize,
      'sentTime'
    ).subscribe({
        next: (response) => {
          const data = response.data ?? [];

          // Adding the ID's of the New Messages to the Hash-Set
          data.forEach(m => { if(m.id) this.messageIdSet.add(m.id); });
          this.messagesSource.next(data);
        }
      });
  }

  // Function to Send Message to Other User in the Conversation
  async sendMessage(conversationId: string, receiverChatId: string, content: string) {
    try {
      // Calling SignalRService to Send the Message
      await this.signalR.sendMessage(conversationId, receiverChatId, content);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }  

  // Function to Handle the Typing indicators
  private handleTypingIndicator(chatId: string) {
    const currentTyping = this.typingUsers.value;
    
    if (!currentTyping.includes(chatId)) {
        this.typingUsers.next([...currentTyping, chatId]);
    }

    // Reset the timer for this specific user
    if (this.typingTimers.has(chatId)) {
        clearTimeout(this.typingTimers.get(chatId));
    }
    // Hide After 3.5 Seconds of no Typing Signals
    const timer = setTimeout(() => {
        const updatedTyping = this.typingUsers.value.filter(id => id !== chatId);
        this.typingUsers.next(updatedTyping);
        this.typingTimers.delete(chatId);
    }, 3500); 

    this.typingTimers.set(chatId, timer);
  }
  
  // Listening to Messages Sent By the Server
  private listenToSignals() {

    // Handle Received Messages and Add it to the Message List
    this.signalR.onMessageReceived().subscribe((data) => {
      this.appendMessage(data.message);
    });

    // Handle Sent Confirmation and Add it to the Message List
    this.signalR.onSentConfirmation().subscribe((data) => {
      this.appendMessage(data.message);
    });

    // Handle Mark Messages as Delivered Confirmation and Update the Messages in Real-Time
    this.signalR.onMarkAsDelivered().subscribe((deliveredBatch) => {
        const currentMessages = this.messagesSource.getValue();
        
        const updatedMessages = currentMessages.map(msg => {
            const updateData = deliveredBatch.find(d => d.id === msg.id);
            
            // Only Update if the Status is Equal to Sent 
            if (updateData && msg.status === MessageStatus.Sent) {
                return Object.assign(msg, { 
                    status: MessageStatus.Delivered, 
                    deliveredTime: updateData.deliveredTime 
                });
            }
            return msg;
        });

        this.messagesSource.next([...updatedMessages]);
    });

    // Handle Mark Messages as Read Confirmation and Update the Messages in Real-Time
    this.signalR.onMarkAsRead()
      .subscribe((data: { conversationId: string, messages: any[] }) => {
        const currentMessages = this.messagesSource.getValue();
        const updatedMessages = currentMessages.map(msg => {
          const updateData = data.messages.find(m => String(m.id) === String(msg.id));
          if (updateData) {
            // Update the Status to Read Regardless of Previous State
            return Object.assign(msg, { 
              status: MessageStatus.Read, 
              readTime: updateData.readTime 
            });
          }
          return msg;
        });
        this.messagesSource.next([...updatedMessages]);
    });

    // Handle the Typing Indicator in Real-Time
    this.signalR.onTyping().subscribe(({ conversationId, senderChatId }) => {
        // Only show if the typing is happening in the active chat window
        if (String(conversationId) === String(this.currentConversationId)) {
            this.handleTypingIndicator(senderChatId);
        }
    });
  }

  // Add New Messages to the Messages List on Load or After Update
  private appendMessage(newMessage: MessagesDto) {
    const currentMessages = this.messagesSource.getValue();
    
    // Prevent duplicate messages (if SentConfirmation and ReceiveMessage overlap)
    if (currentMessages.find(m => m.id === newMessage.id)) return;

    this.messagesSource.next([newMessage, ...currentMessages]);
  }

  // Function for Loading More Messages
  loadMoreMessages( page: number, pageSize: number = 50) {
    if (!this.messagesSource) return;

    // Check if the List is Already Loading or has been Fully Loaded
    if (this.isLoadingSource.value || this.fullListLoadedSource.value) return;
    this.isLoadingSource.next(true);

    // API CALL
    this.messageClient.getMessages(
        this.currentConversationId,
        false, 
        undefined, 
        true, 
        page,
        pageSize,  
        'sentTime',
      ).subscribe({
        next: (result) => {
          const newData = result.data ?? [];
          const currentList = this.messagesSource.value

            
          if (newData.length < pageSize) {
            this.fullListLoadedSource.next(true);
          }

          // Checking Messages ID Set for any Duplicates in Messages List
          const uniqueNewData = newData.filter(msg => {
            if (msg.id && !this.messageIdSet.has(msg.id)) {
              this.messageIdSet.add(msg.id);
              return true;
            }
            return false;
          });

          // Update the Messages List
          this.messagesSource.next([...currentList, ...uniqueNewData]);
          this.isLoadingSource.next(false);
          },
          error: () => this.isLoadingSource.next(false)
      });
  } 

  // Clear All Messages from the List Used when Switching from One Conversation to Another
  clearMessages() {
    this.messagesSource.next([]);
    this.messageIdSet.clear()
    this.fullListLoadedSource.next(false);
    this.isLoadingSource.next(false);
  }
}