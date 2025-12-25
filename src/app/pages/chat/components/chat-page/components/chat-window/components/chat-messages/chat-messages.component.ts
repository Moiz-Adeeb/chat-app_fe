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
  
  // Injectin Services that will be used Later
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  
  // Getting the Chat ID of the Current User
  protected readonly ChatId = this.authService.currentUser.chatId
  
  // Getting the Enum for MessageStatus
  // Sent = 0
  // Delivered = 1
  // Read = 2  
  protected readonly MessageStatus = MessageStatus
  
  // Initialiaing the Scrolling Container the Container that will have diplay the Conversation List
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Getting the Messages List Via the Message Service
  messages$ = this.messageService.messages$;

  // Loadinbg or Full List Loaded Check
  isLoadingMore$ = this.messageService.isLoadingMore$
  isFullListLoaded$ = this.messageService.isFullListLoaded$
  
  // Initial Load
  ngOnInit(): void {
    
    // Subscribe to When the currenc Conversation ID Changes and then Reset the Page & Scroll to the Bottom of the Page
    this.messageService.currentConversationId$
      .pipe(filter(id => id !== null)) 
      .subscribe(() => {
        this.page = 1; 
        this.scrollToBottom();
      });
  }

  // Load More Messages on Scroll Via the Messages Service
  onScroll() {

    // Get the Scrolling Container and Check Position of Scrollbar for Reverse Scroll
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollTop < 300;
    
    // Get Loading Status
    let isLoadingMore = false;
    this.isLoadingMore$.subscribe(state => isLoadingMore = state).unsubscribe();
    
    // Loading Check
    if (atBottom && !isLoadingMore) {

      // Increment in Page
      this.page++

      // API CALL 
      this.messageService.loadMoreMessages(
        this.page,
        this.pageSize,
      )
    }
  }

  // Scroll to the bottom of the Page
  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  // Clear All Messages When Trying to Close the App
  ngOnDestroy(): void {
    this.page = 1
    this.messageService.clearMessages()
  }
}
