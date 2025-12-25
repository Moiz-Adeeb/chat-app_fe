import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { ConversationClient, ConversationDto } from "../api/api";
import { MessageService } from "./message.service";
import { SignalRService } from './signal-r.service';

@Injectable({ 
    providedIn: 'root' 
})

export class ConversationService {

  // Injecting the Message Service to Call Load Messsages Function upon Selecting a Chat
  private messageService = inject(MessageService);
  
  // The Actual Conversation List
  private conversationsSource = new BehaviorSubject<ConversationDto[]>([]);
  public conversations$ = this.conversationsSource.asObservable();

  // Checking if the Conversation List is Loading or has been Completely Loaded
  private isLoadingSource = new BehaviorSubject<boolean>(false);
  public isLoadingMore$ = this.isLoadingSource.asObservable();
  private fullListLoadedSource = new BehaviorSubject<boolean>(false);
  public isFullListLoaded$ = this.fullListLoadedSource.asObservable();
  
  // Stores the Current Conversation
  private selectedConversationSource = new BehaviorSubject<ConversationDto | undefined>(undefined);
  public selectedConversation$ = this.selectedConversationSource.asObservable();
  
  // Hash-Set of Conversation ID's
  private conversationIdSet = new Set<string>();

  // Intialize Constructor for the Conversation Client for API CALL and SignalRService
  constructor(
    private conversationClient: ConversationClient,
    private signalRService: SignalRService
  ) {
      // Listen to Handle Conversation List Update in Real-Time from SignalRService
      this.signalRService.onUpdateUserList().subscribe(data => {
        this.handleRealTimeUpdate(data.conversation, data.lastMessageSnippet, data.unreadCount);
      });
    }

  // Function to Initially Load the Recent Conversation of the User
  fetchConversations(search: string, isDescending: boolean, page: number, pageSize: number) {
    this.isLoadingSource.next(true);
    this.fullListLoadedSource.next(false);

    // API CAll
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

        // Clearing the Previos Conversation ID Hash-Set
        this.conversationIdSet.clear();

        // Adding the ID's of the New conversation to the Hash-Set
        data.forEach(c => { if(c.conversationId) this.conversationIdSet.add(c.conversationId); });
        this.conversationsSource.next(data);

        // Check if all Conversation have been Loaded
        if (data.length < pageSize) this.fullListLoadedSource.next(true);
        this.isLoadingSource.next(false);
      })
    );
  }

  // Function for Adding A New Conversation to the Conversation List
  NewConversationToList(conversation: ConversationDto) {
    const currentList = [...this.conversationsSource.value];
    // Checking if the conversation is Already present in the List by Checking the Conversation ID Set
    const exist = currentList.some(c => c.conversationId === conversation.conversationId);

    if (!exist) {
        currentList.unshift(conversation);
        this.conversationsSource.next(currentList);
    }
  }

  // Function to Update the Unread Count of a Conversation in Real-Time
  handleRealTimeUpdate(conversation: ConversationDto, lastMessageSnippet: string, unreadCount: number) {
    const updatedMetadata = Object.assign(new ConversationDto(), conversation, {
      ...conversation,
      lastMessageSnippet: lastMessageSnippet,
      unreadCount: unreadCount,
    });
    this.UpdateConversationList(updatedMetadata);
  }

  // Function to Update the conversation List in Realtime upon Receiving Message
  UpdateConversationList(conversation: ConversationDto) {
    const currentList = [...this.conversationsSource.value];
    
    // Get the index of the Conversation to Update
    const index = currentList.findIndex(c => c.conversationId === conversation.conversationId);

    // Check if the conversation is in the Conversation Set if so Bring it to Top 
    // Else Add New Conversation List
    if (index !== -1) {
      currentList.splice(index, 1);
    } else {
      if(conversation.conversationId) this.conversationIdSet.add(conversation.conversationId);
    }

    currentList.unshift(conversation);

    this.conversationsSource.next(currentList);
  }

  // Function To Join a Chat  
  selectChat(conversation: ConversationDto) {

    // Set the the Selected Conversation as the conversation you want to initiate now
    this.selectedConversationSource.next(conversation);

    if (conversation.conversationId) {

      // SignalR CALL
      this.signalRService.joinConversation(conversation.conversationId);
      // API Call from the Message Service to Load the Recent Messages of the Conversation
      this.messageService.loadChatHistory(
        conversation.conversationId,
        1,
        10,
      );
    }
  }

  // Function for Loading More Conversations
  loadMoreConversations(search: string, isDescending: boolean, page: number, pageSize: number) {
    if (!this.conversationsSource) return;

    // Check for if the list is already Loading or has been Fully Loaded
    if (this.isLoadingSource.value || this.fullListLoadedSource.value) return;
    this.isLoadingSource.next(true);

    // API CALL
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

          // Check if I have received the end of the list     
          if (newData.length < pageSize) {
            this.fullListLoadedSource.next(true);
          }

          // Checking conversation ID set for duplicates from Conversation List
          const uniqueNewData = newData.filter(conv => {
            if (conv.conversationId && !this.conversationIdSet.has(conv.conversationId)) {
              this.conversationIdSet.add(conv.conversationId);
              return true;
            }
            return false;
          });

          // Update the Conversation List
          this.conversationsSource.next([...currentList, ...uniqueNewData]);
          this.isLoadingSource.next(false);
          },
          error: () => this.isLoadingSource.next(false)
      });
  }  
 
  // Function to Update a Single Conversation Snippet (Called by the SignalR Service)
  updateSnippet(conversationId: string, lastMsg: string) {
    const list = this.conversationsSource.value;

    // Get the Index of the Conversation to Update
    const index = list.findIndex(c => c.conversationId === conversationId);
    if (index !== -1) {
      list[index].lastMessageSnippet = lastMsg;
      // Move to the Top of the List Logic
      const updatedChat = list.splice(index, 1)[0];
      list.unshift(updatedChat);
      this.conversationsSource.next([...list]);
    }
  }

  // Clear all the Conversations from the List 
  clearConversations() {
    this.conversationIdSet.clear();
    this.conversationsSource.next([]);
    this.fullListLoadedSource.next(false);
    this.isLoadingSource.next(false);
    this.selectedConversationSource.next(undefined);
  }
}