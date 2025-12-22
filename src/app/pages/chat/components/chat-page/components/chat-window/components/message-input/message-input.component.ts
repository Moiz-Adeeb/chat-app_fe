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

  @Input() conversationId: string | undefined;
  @Input() receiverChatId: string | undefined;

  private messageService = inject(MessageService);
  private conversationService = inject(ConversationService);
  private alertService = inject(AlertService);
  private signalR = inject(SignalRService);

  private subscription = new Subscription();
  private lastTypingSent = 0;
  
  currentConversation: ConversationDto | undefined = undefined;  
  // currentConversation$ = this.conversationService.selectedConversation$.subscribe({
  //     next: (result) => {
  //       const data = result
  //       this.currentConversation = data
  //     },
  //     error: () => this.alertService.stopLoadingMessage()
  //   });

  messageBox = new FormControl('');
  messageBoxGroup: FormGroup = new FormGroup({
    message: this.messageBox
  });

  ngOnInit(): void {
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

  OnUserTyping() {
    if (!this.currentConversation?.conversationId) return;

    const now = Date.now();
    if (now - this.lastTypingSent > 3000) {
      this.signalR.sendTypingNotification(this.currentConversation.conversationId);
      console.log('Typing')
      this.lastTypingSent = now;
    }
  }

  SendMessage() {
    Object.values(this.messageBoxGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if(this.messageBoxGroup?.valid) {
      if (this.messageBox.value == '') return;
      const content = this.messageBox.value ?? ''
      if (this.currentConversation?.conversationId && this.currentConversation.otherUser?.chatId)
      {
        this.messageService.sendMessage(
          this.currentConversation?.conversationId, 
          this.currentConversation?.otherUser?.chatId,
          content
        );
        this.messageBox.reset();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
