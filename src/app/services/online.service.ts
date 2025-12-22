import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SignalRService } from "./signal-r.service";

@Injectable({ 
    providedIn: 'root' 
})
export class OnlineService {
  private onlineUsersSource = new BehaviorSubject<Set<string>>(new Set());
  public onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private signalR: SignalRService) {
    // 1. Individual status toggles (Existing)
    this.signalR.onUserStatusChange().subscribe((status: any) => {
      if (status?.chatId) this.updateState(status.chatId, status.isOnline);
    });

    // 2. SAFE Bulk Update (Using the new method in SignalRService)
    this.signalR.onCheckOnline().subscribe((statuses: any[]) => {
      this.handleBulkUpdate(statuses);
    });
  }

  private handleBulkUpdate(statuses: any[]) {
    const newSet = new Set<string>(this.onlineUsersSource.value);
    statuses.forEach((s: any) => {
      if (!s.chatId) return;
      const id = s.chatId.toLowerCase().trim();
      if (s.isOnline) newSet.add(id);
      else newSet.delete(id);
    });
    this.onlineUsersSource.next(newSet);
  }

  private updateState(chatId: string, isOnline: boolean) {
    const newSet = new Set<string>(this.onlineUsersSource.value);
    const id = chatId.toLowerCase().trim();
    isOnline ? newSet.add(id) : newSet.delete(id);
    this.onlineUsersSource.next(newSet);
  }
}