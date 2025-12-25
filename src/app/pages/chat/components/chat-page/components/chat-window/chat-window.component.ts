import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationDto } from '../../../../../../api/api';
import { AlertService } from '../../../../../../services/alert.service';
import { MessageService } from '../../../../../../services/message.service';
import { ConversationService } from './../../../../../../services/conversation.service';
import { SignalRService } from './../../../../../../services/signal-r.service';
import { ChatMessagesComponent } from './components/chat-messages/chat-messages.component';
import { ConversationDetailsComponent } from './components/conversation-details/conversation-details.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, ConversationDetailsComponent, ChatMessagesComponent, MessageInputComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit, OnDestroy {

  // Injecting Necessary Service to Use Later 
  private conversationService = inject(ConversationService)
  private messageService = inject(MessageService)
  private signalRService = inject(SignalRService)
  private alertService = inject(AlertService)
  private subscription = new Subscription();

  // Current Conversation From the Conversation Service
  selectedConversation$ = this.conversationService.selectedConversation$;

  // Current Conversaation stored in this Component
  currentConversation: ConversationDto | undefined = undefined;  

  // Upon Initial Load Listen to These
  ngOnInit(): void {

    // Handle Change in the Current COnversation upon Conversation in Change After Listening to SignalR
    this.subscription.add(
      this.conversationService.selectedConversation$.subscribe({
        next: (conversation) => {
          if (conversation) this.handleConversationChange(conversation);
        },
        error: () => this.alertService.stopLoadingMessage()
      })
    )

    // Handle Receiving Messages in Real-Time
    this.subscription.add(
      this.signalRService.onMessageReceived().subscribe(data => {

        // If Message was Received in Current Conversation Mark the Message as Read
        if (data.conversationId === this.currentConversation?.conversationId) {
          this.markAsRead();
        }
      })
    )
  }

  // Function When Moving From One Conversation to Another
  private async handleConversationChange(conversation: ConversationDto) {

    // If Current Conversation is Noe Empty Leave the Current Conversation
    if (this.currentConversation?.conversationId) {
      await this.signalRService
        .leaveConversation(this.currentConversation.conversationId);
    }

    // Set the Curretn Conversation as New Conversation you want to join
    this.currentConversation = conversation

    // Join the Conversation
    await this.signalRService.joinConversation(conversation.conversationId!);

    // mark the Conversation as Read 
    this.markAsRead();
  } 

  // Send Message Via SignalR to Server to Mark A Conversation As Read
  markAsRead() {
    if (this.currentConversation?.conversationId) {
      this.signalRService
        .markConversationAsRead(this.currentConversation.conversationId);
    }
  }

  // Leave the Convesation Upon Trying to Close the App
  ngOnDestroy(): void {
    if (this.currentConversation?.conversationId) {
      this.signalRService.leaveConversation(this.currentConversation.conversationId);
    }
    this.subscription.unsubscribe()
  }
}
