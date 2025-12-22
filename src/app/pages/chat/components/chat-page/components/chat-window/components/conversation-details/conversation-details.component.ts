import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { ConversationDto } from '../../../../../../../../api/api';
import { PipesModule } from '../../../../../../../../pipes/pipes.module';
import { ConversationService } from '../../../../../../../../services/conversation.service';
import { MessageService } from '../../../../../../../../services/message.service';

@Component({
  selector: 'app-conversation-details',
  imports: [CommonModule, PipesModule],
  templateUrl: './conversation-details.component.html',
  styleUrl: './conversation-details.component.css'
})
export class ConversationDetailsComponent {

  @Input() conversation: ConversationDto | undefined;

  private conversationService = inject(ConversationService)
  protected messageService = inject(MessageService)
  selectedConversation$ = this.conversationService.selectedConversation$
}
