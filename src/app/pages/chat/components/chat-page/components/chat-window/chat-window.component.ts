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
  
  private conversationService = inject(ConversationService)
  private messageService = inject(MessageService)
  private signalRService = inject(SignalRService)
  private alertService = inject(AlertService)

  private subscription = new Subscription();
  selectedConversation$ = this.conversationService.selectedConversation$;
  currentConversation: ConversationDto | undefined = undefined;
  
  // currentConversation$ = this.conversationService.selectedConversation$.subscribe({
  //     next: (result) => {
  //       const data = result
  //       this.currentConversation = data
  //     },
  //     error: () => this.alertService.stopLoadingMessage()
  //   });  


  ngOnInit(): void {
    this.subscription.add(
      this.conversationService.selectedConversation$.subscribe({
        next: (conversation) => {
          if (conversation) this.handleConversationChange(conversation);
        },
        error: () => this.alertService.stopLoadingMessage()
      })
    )

    this.subscription.add(
      this.signalRService.onMessageReceived().subscribe(data => {
        if (data.conversationId === this.currentConversation?.conversationId) {
          this.markAsRead();
        }
      })
    )
    // if (this.currentConversation?.conversationId) {
    //   this.signalRService.markConversationAsRead(
    //     this.currentConversation?.conversationId
    //   );
    //   this.signalRService.joinConversation(
    //     this.currentConversation?.conversationId
    //   );

    // }
  }

  private async handleConversationChange(conversation: ConversationDto) {
    if (this.currentConversation?.conversationId) {
      await this.signalRService
        .leaveConversation(this.currentConversation.conversationId);
    }

    this.currentConversation = conversation

    await this.signalRService
      .joinConversation(conversation.conversationId!);

    this.markAsRead();
  } 

  markAsRead() {
    if (this.currentConversation?.conversationId) {
      this.signalRService
        .markConversationAsRead(this.currentConversation.conversationId);
    }
  }

  ngOnDestroy(): void {
    if (this.currentConversation?.conversationId) {
      this.signalRService
        .leaveConversation(this.currentConversation.conversationId);
    }
    this.subscription.unsubscribe()
  }
}
