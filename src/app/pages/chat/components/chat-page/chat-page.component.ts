import { Component, OnDestroy, OnInit } from '@angular/core';
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

  // Initializing Constructor for SignalRService to Connect to the Websocket Connection
  constructor(
    private signalRService: SignalRService
  ) {
      // Check Before the page Loads if the Websocket is Connected if not then Connect
      if (this.signalRService.hubConnection?.state !== signalR.HubConnectionState.Connected) {
        this.signalRService.init()    
        this.signalRService.connect(); 
      }
    }

  ngOnInit(): void {
    
  }

  // Disconnect from the Websocket Upon Trying to Close the App
  ngOnDestroy() : void {
    this.signalRService.disconnect();
  }

}
