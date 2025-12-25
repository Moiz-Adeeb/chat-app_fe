import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConversationDto } from '../../../../../../../../api/api';
import { ConversationService } from '../../../../../../../../services/conversation.service';
import { MessageService } from '../../../../../../../../services/message.service';
import { AppButtonComponent } from "../../../../../../../../shared/app-button/components/app-button/app-button.component";
import { AppTextAreaFieldComponent } from '../../../../../../../../shared/app-text-area-field/components/app-text-area-field/app-text-area-field.component';
import { AlertService } from './../../../../../../../../services/alert.service';
import { SignalRService } from './../../../../../../../../services/signal-r.service';

@Component({
  selector: 'app-message-input',
  imports: [CommonModule,  AppTextAreaFieldComponent, AppButtonComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent implements OnInit {

  // Inputs from Parent Chat Winodw Component
  @Input() conversationId: string | undefined;
  @Input() receiverChatId: string | undefined;

  // Injecting Necessary Services to Use Later 
  private messageService = inject(MessageService);
  private conversationService = inject(ConversationService);
  private alertService = inject(AlertService);
  private signalR = inject(SignalRService);
  private subscription = new Subscription();
  private lastTypingSent = 0;
  
  // The Current Conversation
  currentConversation: ConversationDto | undefined = undefined;  

  // Message Input Controls
  messageBox = new FormControl('');
  messageBoxGroup: FormGroup = new FormGroup({ message: this.messageBox });

  // Listen To Signals
  ngOnInit(): void {
    // Listen to Conversation Change in Real-TIme
    this.subscription.add(
      this.conversationService.selectedConversation$.subscribe({
        next: (result) => {
          this.currentConversation = result;
          this.messageBox.reset();
        },
        error: () => this.alertService.stopLoadingMessage()
      })
    )
  }

  // Functon to Send Typing Indicator When the User is Typing
  OnUserTyping() {
    if (!this.currentConversation?.conversationId) return;
    const now = Date.now();

    // Send typing Indicator Only Every 3 Seconds
    if (now - this.lastTypingSent > 3000) {
      this.signalR.sendTypingNotification(this.currentConversation.conversationId);
      this.lastTypingSent = now;
    }
  }

  // Function to send Message to the User Via SignalR
  SendMessage() {
    Object.values(this.messageBoxGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if(this.messageBoxGroup?.valid) {

      // Check if Message is Empty
      if (this.messageBox.value == '') return;
      const content = this.messageBox.value ?? ''

      if (this.currentConversation?.conversationId && this.currentConversation.otherUser?.chatId)
      {
        // Send message Via the Message Service
        this.messageService.sendMessage(
          this.currentConversation?.conversationId, 
          this.currentConversation?.otherUser?.chatId,
          content
        );

        // Reset the Message Box to Empty
        this.messageBox.reset();
      }
    }
  }

  // On Closing The App
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
