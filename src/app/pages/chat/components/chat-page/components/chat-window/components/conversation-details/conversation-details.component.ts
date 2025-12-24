import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { map } from 'rxjs';
import { ConversationDto } from '../../../../../../../../api/api';
import { PipesModule } from '../../../../../../../../pipes/pipes.module';
import { ConversationService } from '../../../../../../../../services/conversation.service';
import { MessageService } from '../../../../../../../../services/message.service';
import { OnlineService } from '../../../../../../../../services/online.service';

@Component({
  selector: 'app-conversation-details',
  imports: [CommonModule, PipesModule],
  templateUrl: './conversation-details.component.html',
  styleUrl: './conversation-details.component.css'
})
export class ConversationDetailsComponent {

  @Input() conversation: ConversationDto | undefined;

  protected onlineService = inject(OnlineService);
  private conversationService = inject(ConversationService)
  protected messageService = inject(MessageService)
  selectedConversation$ = this.conversationService.selectedConversation$

  isOnline$(chatId: string | undefined) {
    return this.onlineService.onlineUsers$.pipe(
      map(set => {
        if (!chatId) return false;
        return set.has(chatId.toLowerCase().trim());
      })
    );
  }
}
