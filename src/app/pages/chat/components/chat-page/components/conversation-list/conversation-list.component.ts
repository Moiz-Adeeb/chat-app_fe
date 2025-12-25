import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { PipesModule } from "../../../../../../pipes/pipes.module";
import { AuthService } from '../../../../../../services/auth.service';
import { OnlineService } from '../../../../../../services/online.service';
import { SignalRService } from '../../../../../../services/signal-r.service';
import { BasePaginationComponent } from '../../../../../../shared/base-pagination-component';
import { ConversationDto } from './../../../../../../api/api';
import { ConversationService } from './../../../../../../services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  imports: [CommonModule, PipesModule],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})

export class ConversationListComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  // Function to Track Each Conversation in the List by ID for Effeciency
  trackById(index: number, item: ConversationDto): string | undefined {
    return item.conversationId;
  }

  // Injecting the Necessary Services into the Component for Later Use
  private conversationService = inject(ConversationService);
  protected onlineService = inject(OnlineService);
  private authService = inject(AuthService);
  private signalRService = inject(SignalRService);

  // Initialiaing the Scrolling Container the Container that will have diplay the Conversation List
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  // The Currently Selected Conversation
  selectedConversation$ = this.conversationService.selectedConversation$
  selectedConversationId: string | undefined = undefined;

  // The List of Conversations
  conversations$ = this.conversationService.conversations$;

  // Loading Checks
  isLoadingMore$ = this.conversationService.isLoadingMore$
  isFullListLoaded$ = this.conversationService.isFullListLoaded$
  
  // Chat ID of the Current User
  chatId = this.authService.currentUser.chatId

  ngOnInit(): void {
    // Clear the previous Conversations for any Mismatch
    this.conversationService.clearConversations(); 

    // Get the Conversatoins with API CALL
    this.getData()
    console.log('Current User ChatId: ' + this.chatId)
        console.log(this.onlineService.onlineUsers$)
  }
  
  ngOnDestroy(): void {
    // Clear the Conversations for any Future Mismatch
    this.conversationService.clearConversations();   
  }

  // Function to check if User is Online with Chat ID of the User as Input
  isOnline$(chatId: string | undefined) {
    return this.onlineService.onlineUsers$.pipe(
      map(set => {
        if (!chatId) return false;
        return set.has(chatId.toLowerCase().trim());
      })
    );
  }
  
  // Function to get Initial Load of Conversations from Conversation Service
  protected override getData(): void {
    this.alertService.startLoadingMessage();

    // API CALL
    this.conversationService.fetchConversations(
      this.search,
      true,
      this.page,
      50,
    ).subscribe({
        next: async (result) => {
          this.alertService.stopLoadingMessage();
          this.totalPage = result.count ?? 0;

          // Map all Chat ID's in an Array to check them
          const chatIds = result.data?.map((c: any) => c.otherUser?.chatId)
            .filter((id: string) => !!id) ?? [];

          if (chatIds.length > 0) {

            // Wait for the SignalR to COnnect
            await this.signalRService.waitForConnection();
            
            // Check if the Users are Online or Not
            await this.signalRService.checkOnlineStatus(chatIds);
          }

          this.setPagination();
        },
        error: () => this.alertService.stopLoadingMessage()
      });
  }

  // Function to Select a and Join a Conversation from Conversation Service 
  conversationClick(chat: ConversationDto) {
    this.conversationService.selectChat(chat);
  }

  private lastScrollTime = 0;

  // Function to Load More Conversations Upon Scrolling in the Conversation List Div
  onScroll() {
    const now = Date.now();

    // Check Last Scroll Time
    if (now - this.lastScrollTime < 100) return;
    this.lastScrollTime = now;

    // Get the Scrolling Container and Check Position of Scrollbar
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    // Subscibe to Check Loading State
    let isLoadingMore = false;
    this.isLoadingMore$.subscribe(state => isLoadingMore = state).unsubscribe();
    
    // Final Check to See if Already Loading or if not at the Bottom
    if (atBottom && !isLoadingMore) {
      // Increment in Page
      this.page++

      // API CALL
      this.conversationService.loadMoreConversations(
        this.search,
        true,
        this.page,
        this.pageSize,
      )
    }
  }
}
