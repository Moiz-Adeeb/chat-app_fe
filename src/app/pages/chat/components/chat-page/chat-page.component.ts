import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SignalRService } from '../../../../services/signal-r.service';
import { ChatWindowComponent } from "./components/chat-window/chat-window.component";
import { ConversationListComponent } from "./components/conversation-list/conversation-list.component";
import { SearchUsersComponent } from './components/search-users/search-users.component';

@Component({
  selector: 'app-chat-page',
  imports: [ChatWindowComponent, ConversationListComponent, SearchUsersComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, OnDestroy{
sidebarCollapsed: any;
  signalR = inject(SignalRService)

  ngOnInit(): void {
    if (this.signalR.hubConnection?.state !== signalR.HubConnectionState.Connected) {
          this.signalR.connect(); 
        }
  }

  ngOnDestroy() : void {
    this.signalR.disconnect();
  }

}
