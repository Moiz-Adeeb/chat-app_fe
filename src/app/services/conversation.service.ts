import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { ConversationClient, ConversationDto } from "../api/api";
import { MessageService } from "./message.service";
import { SignalRService } from './signal-r.service';

@Injectable({ 
    providedIn: 'root' 
})

export class ConversationService {

  private messageService = inject(MessageService);
  // private signalRService = inject(SignalRService);
  

  private conversationsSource = new BehaviorSubject<ConversationDto[]>([]);
  public conversations$ = this.conversationsSource.asObservable();
  private isLoadingSource = new BehaviorSubject<boolean>(false);
  public isLoadingMore$ = this.isLoadingSource.asObservable();
  private fullListLoadedSource = new BehaviorSubject<boolean>(false);
  public isFullListLoaded$ = this.fullListLoadedSource.asObservable();
  private selectedConversationSource = new BehaviorSubject<ConversationDto | undefined>(undefined);
  public selectedConversation$ = this.selectedConversationSource.asObservable();
  // Hash-Set
  private conversationIdSet = new Set<string>();

  constructor(
    private conversationClient: ConversationClient,
    private signalRService: SignalRService
  ) {
      this.signalRService.onUpdateUserList().subscribe(data => {
        this.handleRealTimeUpdate(data.conversation, data.lastMessageSnippet, data.unreadCount);
      });
    }

  fetchConversations(search: string, isDescending: boolean, page: number, pageSize: number) {
    this.isLoadingSource.next(true);
    this.fullListLoadedSource.next(false);
    return this.conversationClient.getConversations(
      false, 
      search, 
      true, 
      page, 
      pageSize, 
      'lastMessageTime'
    ).pipe(
      tap(result => {
        const data = result.data ?? [];
        this.conversationIdSet.clear();
        data.forEach(c => { if(c.conversationId) this.conversationIdSet.add(c.conversationId); });
        this.conversationsSource.next(data);
        if (data.length < pageSize) this.fullListLoadedSource.next(true);
        this.isLoadingSource.next(false);
      })
    );
  }

  NewConversationToList(conversation: ConversationDto) {
    const currentList = [...this.conversationsSource.value];
    const exist = currentList.some(c => c.conversationId === conversation.conversationId);

    if (!exist) {
        currentList.unshift(conversation);
        this.conversationsSource.next(currentList);
    }
  }

  handleRealTimeUpdate(conversation: ConversationDto, lastMessageSnippet: string, unreadCount: number) {
    const updatedMetadata = Object.assign(new ConversationDto(), conversation, {
      ...conversation,
      lastMessageSnippet: lastMessageSnippet,
      unreadCount: unreadCount,
    });
    this.UpdateConversationList(updatedMetadata);
  }

  UpdateConversationList(conversation: ConversationDto) {
    const currentList = [...this.conversationsSource.value];
    
    const index = currentList.findIndex(c => c.conversationId === conversation.conversationId);

    if (index !== -1) {
      currentList.splice(index, 1);
    } else {
      if(conversation.conversationId) this.conversationIdSet.add(conversation.conversationId);
    }

    currentList.unshift(conversation);

    this.conversationsSource.next(currentList);
  }

  selectChat(conversation: ConversationDto) {
    this.selectedConversationSource.next(conversation);

    if (conversation.conversationId) {
      this.signalRService.joinConversation(conversation.conversationId);
      this.messageService.loadChatHistory(
        conversation.conversationId,
        1,
        10,
      );
    }

    // this.conversationService.markAsReadLocally(chat.conversationId);

    // this.conversationClient.markAsRead(chat.conversationId).subscribe();

    // 4. Load history via the MessageService

    // // 5. SignalR: Set active context
    // // This helps our Hub know that incoming messages for THIS ID should be marked as 'read' instantly
    // this.chatHubService.currentActiveChatId = chat.conversationId;
  }

  loadMoreConversations(search: string, isDescending: boolean, page: number, pageSize: number) {
    //const currentList = this.conversationsSource.value;
    if (!this.conversationsSource) return;

    // Guard: Don't load if already loading or if we've reached the end
    if (this.isLoadingSource.value || this.fullListLoadedSource.value) return;

    this.isLoadingSource.next(true);

    this.conversationClient.getConversations(
        false, 
        search, 
        true, 
        page,
        pageSize,  
        'lastMessageTime',
      ).subscribe({
        next: (result) => {
          const newData = result.data ?? [];
          const currentList = this.conversationsSource.value

            
          if (newData.length < pageSize) {
            this.fullListLoadedSource.next(true);
          }

          const uniqueNewData = newData.filter(conv => {
            if (conv.conversationId && !this.conversationIdSet.has(conv.conversationId)) {
              this.conversationIdSet.add(conv.conversationId);
              return true;
            }
            return false;
          });

          // Append new data to existing list
          // newData.forEach(element => {
          //   const exist = currentList.some(c => c.conversationId === element.conversationId);
          //   if (exist) {
          //     var index = newData.findIndex(c => c.conversationId === element.conversationId)
          //     if (index !== -1) newData.splice(index,1);
          //   }
          // });
          this.conversationsSource.next([...currentList, ...uniqueNewData]);
          this.isLoadingSource.next(false);
          },
          error: () => this.isLoadingSource.next(false)
      });
  }  
 
  // Method to update a single conversation snippet (called by SignalR)
  updateSnippet(conversationId: string, lastMsg: string) {
    const list = this.conversationsSource.value;
    const index = list.findIndex(c => c.conversationId === conversationId);
    if (index !== -1) {
      list[index].lastMessageSnippet = lastMsg;
      // Move to top logic
      const updatedChat = list.splice(index, 1)[0];
      list.unshift(updatedChat);
      this.conversationsSource.next([...list]);
    }
  }


  clearConversations() {
    this.conversationIdSet.clear();
    this.conversationsSource.next([]);
    this.fullListLoadedSource.next(false);
    this.isLoadingSource.next(false);
    this.selectedConversationSource.next(undefined);
  }
}