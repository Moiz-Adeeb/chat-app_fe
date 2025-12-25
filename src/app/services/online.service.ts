import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SignalRService } from "./signal-r.service";

@Injectable({ 
    providedIn: 'root' 
})
export class OnlineService {

  // Hash-Set of all the Currently Online Users
  private onlineUsersSource = new BehaviorSubject<Set<string>>(new Set());
  public onlineUsers$ = this.onlineUsersSource.asObservable();

  // Initializing SignalRService as a Constructor to use Later and Listening to Signals
  constructor(
    private signalR: SignalRService
  ) {
      // Status Toggles from the SignalRService when a User Comes On;line or goes Offline
      this.signalR.onUserStatusChange().subscribe((status: any) => {
        if (status?.chatId) this.updateState(status.chatId, status.isOnline);
      });

      // Getting the Initial List of Online users
      this.signalR.onCheckOnline().subscribe((statuses: any[]) => {
        this.handleBulkUpdate(statuses);
      });
    }

  // Handle the Inital List Loading from teh SignalRHub
  private handleBulkUpdate(statuses: any[]) {
    const newSet = new Set<string>(this.onlineUsersSource.value);
    // Loops Over All the Users and Their Status Objetcs
    statuses.forEach((s: any) => {
      // Checks for ChatID
      if (!s.chatId) return;
      const id = s.chatId.toLowerCase().trim();
      // Checks for IsOnine Boolean if True Adds it to the Set
      if (s.isOnline) newSet.add(id);
      else newSet.delete(id);
    });
    this.onlineUsersSource.next(newSet);
  }

  // Handle Status Toggles from the SignalRHub for Individual Users 
  private updateState(chatId: string, isOnline: boolean) {
    const newSet = new Set<string>(this.onlineUsersSource.value);
    const id = chatId.toLowerCase().trim();
    isOnline ? newSet.add(id) : newSet.delete(id);
    this.onlineUsersSource.next(newSet);
  }
}