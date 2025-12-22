import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from '../../../../services/signal-r.service';
import { AppSidebarComponent } from './../../../../shared/sidebar/components/app-sidebar.component';
import { ChatWindowComponent } from "./components/chat-window/chat-window.component";
import { ConversationListComponent } from "./components/conversation-list/conversation-list.component";
import { SearchUsersComponent } from './components/search-users/search-users.component';

@Component({
  selector: 'app-chat-page',
  imports: [ChatWindowComponent, ConversationListComponent, SearchUsersComponent, AppSidebarComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, OnDestroy{
sidebarCollapsed: any;
  signalR = inject(SignalRService)

  ngOnInit(): void {
    this.signalR.init();
    this.signalR.connect();
  }

  ngOnDestroy() : void {
    this.signalR.disconnect();
  }

}
