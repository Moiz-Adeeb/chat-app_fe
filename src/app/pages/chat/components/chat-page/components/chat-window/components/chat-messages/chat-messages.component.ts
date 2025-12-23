import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs';
import { PipesModule } from "../../../../../../../../pipes/pipes.module";
import { AuthService } from '../../../../../../../../services/auth.service';
import { BasePaginationComponent } from '../../../../../../../../shared/base-pagination-component';
import { MessageStatus } from './../../../../../../../../api/api';
import { MessageService } from './../../../../../../../../services/message.service';

@Component({
  selector: 'app-chat-messsages',
  imports: [CommonModule, PipesModule],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss'
})
export class ChatMessagesComponent extends BasePaginationComponent  implements OnInit, OnDestroy {
  
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  protected readonly MessageStatus = MessageStatus
  protected readonly ChatId = this.authService.currentUser.chatId
  

  messages$ = this.messageService.messages$;
  isLoadingMore$ = this.messageService.isLoadingMore$
  isFullListLoaded$ = this.messageService.isFullListLoaded$

  private lastScrollTime = 0;
  
  ngOnInit(): void {
    // Subscribe to the Observable ($), not the raw property
    this.messageService.currentConversationId$
      .pipe(filter(id => id !== null)) // Only act if we have a real ID
      .subscribe(() => {
        this.page = 1; // Reset local pagination
        this.scrollToBottom(); // Reset scroll position
      });
  }

  onScroll() {
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollTop < 300;
    
    let isLoadingMore = false;
    this.isLoadingMore$.subscribe(state => isLoadingMore = state).unsubscribe();
    
    if (atBottom && !isLoadingMore) {
      this.page++
      this.messageService.loadMoreMessages(
        this.page,
        this.pageSize,
      )
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.page = 1
    this.messageService.clearMessages()
  }
}
