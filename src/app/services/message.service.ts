import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessagesClient, MessagesDto, MessageStatus } from '../api/api';
import { SignalRService } from './signal-r.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messageClient = inject(MessagesClient);
  private signalR = inject(SignalRService);
  protected readonly MessageStatus = MessageStatus

  private currentConversationId: string | null = null;
  
  // This holds the messages for the currently active chat window
  private messagesSource = new BehaviorSubject<MessagesDto[]>([]);
  public messages$ = this.messagesSource.asObservable();
  private typingUsers = new BehaviorSubject<string[]>([]); 
  public typingUsers$ = this.typingUsers.asObservable();
  private typingTimers = new Map<string, any>();

  constructor() {
    this.listenToSignals();
  }

  // Phase 2: GET /chat/history/{chatId}
  loadChatHistory(chatId: string, page: number, pageSize: number) {
    this.currentConversationId = chatId;
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
          console.log(response)
          this.messagesSource.next(response.data ?? []);
        }
      });
  }

  async sendMessage(conversationId: string, receiverChatId: string, content: string) {
    try {
      // We call the hub method. The Hub will respond via 'SentMessage' 
      // which we handle in listenToSignals() to avoid duplicate logic.
      await this.signalR.sendMessage(conversationId, receiverChatId, content);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }  

  private handleTypingIndicator(chatId: string) {
    const currentTyping = this.typingUsers.value;
    
    if (!currentTyping.includes(chatId)) {
        this.typingUsers.next([...currentTyping, chatId]);
    }

    // Reset the timer for this specific user
    if (this.typingTimers.has(chatId)) {
        clearTimeout(this.typingTimers.get(chatId));
    }

    const timer = setTimeout(() => {
        const updatedTyping = this.typingUsers.value.filter(id => id !== chatId);
        this.typingUsers.next(updatedTyping);
        this.typingTimers.delete(chatId);
    }, 3500); // Hide after 3.5 seconds of no typing signals

    this.typingTimers.set(chatId, timer);
  }


  private listenToSignals() {
    // 1. Handle Received Messages
    this.signalR.onMessageReceived().subscribe((data) => {
      this.appendMessage(data.message);
    });

    // 2. Handle Sent Confirmation (to update status from 'pending' to 'sent')
    this.signalR.onSentConfirmation().subscribe((data) => {
      this.appendMessage(data.message);
    });

    this.signalR.onMarkAsDelivered().subscribe((deliveredBatch) => {
        const currentMessages = this.messagesSource.getValue();
        
        const updatedMessages = currentMessages.map(msg => {
            const updateData = deliveredBatch.find(d => d.id === msg.id);
            
            // Only update if current status is lower than Delivered (1 -> 2)
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

    // 3. Handle Status Updates (Mark as Read/Delivered)
    this.signalR.onMarkAsRead()
      .subscribe((data: { conversationId: string, messages: any[] }) => {
        const currentMessages = this.messagesSource.getValue();
        const updatedMessages = currentMessages.map(msg => {
          const updateData = data.messages.find(m => String(m.id) === String(msg.id));
          if (updateData) {
            // Object.assign updates 'msg' in place while keeping it a MessagesDto instance
            return Object.assign(msg, { 
              status: MessageStatus.Read, 
              readTime: updateData.readTime 
            });
          }
          return msg;
        });
        this.messagesSource.next([...updatedMessages]);
    });

    this.signalR.onTyping().subscribe(({ conversationId, senderChatId }) => {
        // Only show if the typing is happening in the active chat window
        if (String(conversationId) === String(this.currentConversationId)) {
            this.handleTypingIndicator(senderChatId);
        }
    });
  }

  private appendMessage(newMessage: MessagesDto) {
    const currentMessages = this.messagesSource.getValue();
    
    // Prevent duplicate messages (if SentConfirmation and ReceiveMessage overlap)
    if (currentMessages.find(m => m.id === newMessage.id)) return;

    this.messagesSource.next([newMessage, ...currentMessages]);
  }

  // Clear messages when closing a chat
  clearMessages() {
    this.messagesSource.next([]);
  }
}