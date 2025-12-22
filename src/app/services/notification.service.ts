import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationClient, NotificationDto } from '../api/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);

  public unreadCount$: Observable<number> =
    this.unreadCountSubject.asObservable();
  public notifications$: Observable<NotificationDto[]> =
    this.notificationsSubject.asObservable();

  constructor(private notificationClient: NotificationClient) {}

  /**
   * Load unread notification count and update all subscribers
   */
  loadUnreadCount(): void {
    this.notificationClient
      .notification_GetUnReadNotificationCount()
      .subscribe((res) => {
        const count = res.count ?? 0;
        this.unreadCountSubject.next(count);
      });
  }

  /**
   * Load notifications list and update all subscribers
   */
  loadNotifications(pageNumber: number = 1, pageSize: number = 10): void {
    this.notificationClient
      .notification_GetNotifications(
        undefined,
        false,
        null,
        true,
        pageNumber,
        pageSize,
        null,
      )
      .subscribe((res) => {
        const notifications = res.data ?? [];
        this.notificationsSubject.next(notifications);
      });
  }

  /**
   * Load both count and notifications
   */
  refreshAll(pageNumber: number = 1, pageSize: number = 10): void {
    this.loadUnreadCount();
    this.loadNotifications(pageNumber, pageSize);
  }

  /**
   * Mark a single notification as read and refresh
   */
  markAsRead(id: string): Observable<any> {
    return new Observable((observer) => {
      this.notificationClient.notification_ReadNotification(id).subscribe({
        next: (res) => {
          this.refreshAll();
          observer.next(res);
          observer.complete();
        },
      });
    });
  }

  /**
   * Mark all notifications as read and refresh
   */
  markAllAsRead(): Observable<any> {
    return new Observable((observer) => {
      this.notificationClient
        .notification_ReadAllUnReadNotification()
        .subscribe({
          next: (res) => {
            this.refreshAll();
            observer.next(res);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          },
        });
    });
  }

  /**
   * Get current unread count value
   */
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Get current notifications value
   */
  getCurrentNotifications(): NotificationDto[] {
    return this.notificationsSubject.value;
  }
}
