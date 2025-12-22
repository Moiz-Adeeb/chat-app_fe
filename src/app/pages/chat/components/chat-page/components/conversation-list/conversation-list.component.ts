import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Subject } from 'rxjs';
import { OnlineStatusPipe } from "../../../../../../pipes/online-status.pipe";
import { PipesModule } from "../../../../../../pipes/pipes.module";
import { AuthService } from '../../../../../../services/auth.service';
import { LocalStoreManager } from '../../../../../../services/local-store-manager.service';
import { MessageService } from '../../../../../../services/message.service';
import { OnlineService } from '../../../../../../services/online.service';
import { SignalRService } from '../../../../../../services/signal-r.service';
import { BasePaginationComponent } from '../../../../../../shared/base-pagination-component';
import { ConversationClient, ConversationDto } from './../../../../../../api/api';
import { ConversationService } from './../../../../../../services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  imports: [CommonModule, PipesModule, OnlineStatusPipe],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  trackById(index: number, item: ConversationDto): string | undefined {
    return item.conversationId;
  }

  private localStoreService = inject(LocalStoreManager);
  private conversationService = inject(ConversationService);
  protected onlineService = inject(OnlineService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private signalRService = inject(SignalRService);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  private destroy$ = new Subject<void>();

  selectedConversation$ = this.conversationService.selectedConversation$
  conversations$ = this.conversationService.conversations$;
  isLoadingMore$ = this.conversationService.isLoadingMore$
  isFullListLoaded$ = this.conversationService.isFullListLoaded$
  
  constructor(
    private conversationClient: ConversationClient,
  ) {
    super();
  }
  
  chatId = this.authService.currentUser.chatId
  ngOnInit(): void {
    this.conversationService.clearConversations(); 
    this.getData()
    console.log('Current User ChatId: ' + this.chatId)
        console.log(this.onlineService.onlineUsers$)
  }

  isOnline$(chatId: string | undefined) {
    return this.onlineService.onlineUsers$.pipe(
      map(set => {
        if (!chatId) return false;
        // Normalization is key: GUIDs often change case
        return set.has(chatId.toLowerCase().trim());
      })
    );
  }

  ngOnDestroy(): void {
    this.conversationService.clearConversations();   
  }
  
  protected override getData(): void {
    this.alertService.startLoadingMessage();
    this.conversationService.fetchConversations(
      this.search,
      true,
      this.page,
      this.pageSize,
    ).subscribe({
        next: (result) => {
          this.alertService.stopLoadingMessage();
          this.totalPage = result.count ?? 0;

          const chatIds = result.data?.map((c: any) => c.otherUser?.chatId)
            .filter((id: string) => !!id) ?? [];

          if (chatIds.length > 0) {
            this.signalRService.hubConnection.invoke('CheckOnline', chatIds);
          }

          this.setPagination();
        },
        error: () => this.alertService.stopLoadingMessage()
      });
  }

  selectedConversationId: string | undefined = undefined;

  conversationClick(chat: ConversationDto) {
    this.conversationService.selectChat(chat);
  }

  private lastScrollTime = 0;

  onScroll() {
    const now = Date.now();
    if (now - this.lastScrollTime < 300) return;
    this.lastScrollTime = now;
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 300;

    let isLoadingMore = false;
    this.isLoadingMore$.subscribe(state => isLoadingMore = state).unsubscribe();
    
    if (atBottom && !isLoadingMore) {
      this.page++
      this.conversationService.loadMoreConversations(
        this.search,
        true,
        this.page,
        this.pageSize,
      )
    }
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.getData();
  }
}
