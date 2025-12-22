import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AppButtonComponent } from '../../../app-button/components/app-button/app-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { HelperFunction } from '../../../../constants/role-names';
import { NotificationClient, NotificationDto } from '../../../../api/api';
import { NotificationService } from '../../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-pop',
  templateUrl: './app-notification-pop.component.html',
  imports: [
    AppButtonComponent,
    NgIf,
    TranslatePipe,
    PipesModule,
    NgForOf,
    NgClass,
  ],

  styleUrls: ['./app-notification-pop.component.css'],

  standalone: true,
})
export class AppNotificationPopComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    public helperFunction: HelperFunction,
    private elementRef: ElementRef,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.subscribeToNotifications();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  unreadCount = 0;
  showNotifications = false;
  notifications: NotificationDto[] = [];

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  /**
   * Subscribe to notification service observables
   * This ensures UI updates whenever notifications change
   */
  subscribeToNotifications(): void {
    // Subscribe to unread count changes
    this.subscriptions.push(
      this.notificationService.unreadCount$.subscribe((count) => {
        this.unreadCount = count;
      })
    );

    // Subscribe to notifications list changes
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe((notifications) => {
        this.notifications = notifications;
      })
    );
  }

  /**
   * Load notifications using the shared notification service
   */
  loadNotifications(): void {
    this.notificationService.refreshAll(1, 10);
  }

  onViewAllNotifications() {
    this.showNotifications = !this.showNotifications;
    this.router.navigate(['/dashboard/notifications']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showNotifications = false;
    }
  }

  readNotification(id: string | undefined) {
    this.alertService.startLoadingMessage();
    this.notificationService.markAsRead(id ?? '').subscribe(() => {
      this.alertService.stopLoadingMessage();
    });
  }

  markAllAsRead() {
    this.alertService.startLoadingMessage();
    this.notificationService.markAllAsRead().subscribe(() => {
      this.alertService.stopLoadingMessage();
    });
  }
}
