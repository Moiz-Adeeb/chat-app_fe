import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessagesClient } from '../api/api';

@Injectable({ 
  providedIn: 'root' 
})

export class UnreadMessageService {

  // Inject Messages Client for Initial API CALL for Unread Messages
  private messageClient = inject(MessagesClient);
  
  // Stores the Unread Messages Count and Updates in Real-Time
  private unreadMessagesSource = new BehaviorSubject<number>(0);
  public unreadMessages$ = this.unreadMessagesSource.asObservable();

  // Get the Initial Unread Messages Count upon Login
  unreadMessages() {
    // API CALL
    this.messageClient.getUnreadMessages(undefined)
      .subscribe({
        next: (response) => {
          console.log(response)
          this.unreadMessagesSource.next(response.count ?? 0);
        }
      });
  }

  // Update the Unread Message Count in Real-Time when it is Update from the SignalRService
  updateCount(count: number) {
    this.unreadMessagesSource.next(count);
  }

  // Clear Unread Messages Count 
  clearMessages() {
    this.unreadMessagesSource.next(0);
  }
}