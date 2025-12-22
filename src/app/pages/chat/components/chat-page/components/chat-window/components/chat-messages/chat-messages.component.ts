import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PipesModule } from "../../../../../../../../pipes/pipes.module";
import { AuthService } from '../../../../../../../../services/auth.service';
import { MessageStatus } from './../../../../../../../../api/api';
import { MessageService } from './../../../../../../../../services/message.service';

@Component({
  selector: 'app-chat-messsages',
  imports: [CommonModule, PipesModule],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss'
})
export class ChatMessagesComponent {

  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  protected readonly MessageStatus = MessageStatus
  protected readonly ChatId = this.authService.currentUser.chatId

  messages$ = this.messageService.messages$
}
