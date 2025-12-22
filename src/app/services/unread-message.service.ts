import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessagesClient, MessagesDto } from '../api/api';

@Injectable({ providedIn: 'root' })
export class UnreadMessageService {
  private messageClient = inject(MessagesClient);
  
  private unreadMessagesSource = new BehaviorSubject<number>(0);
  public unreadMessages$ = this.unreadMessagesSource.asObservable();

  unreadMessages() {
    this.messageClient.getUnreadMessages(undefined)
      .subscribe({
        next: (response) => {
          console.log(response)
          this.unreadMessagesSource.next(response.count ?? 0);
        }
      });
  }

  // Clear messages when closing a chat
  clearMessages() {
    this.unreadMessagesSource.next(0);
  }
}