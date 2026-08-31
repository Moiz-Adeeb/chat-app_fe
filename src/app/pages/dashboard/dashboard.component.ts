import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { SignalRService } from '../../services/signal-r.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AppSidebarComponent } from '../../shared/sidebar/components/app-sidebar.component';
import { SidebarService } from '../../services/sidebar.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoleNames } from '../../constants/role-names';
import { AppHeaderComponent } from '../../shared/header/components/app-header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, AppSidebarComponent, AppHeaderComponent, CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // public notifications: NotificationDto[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  authorized = true;
  unreadCount = 0;
  subscriptions: Subscription[] = [];
  currentUrl: string = '/dashboard/companies/company-details';
  sidebarCollapsed = true;
  mobileSidebarOpen = false;

  constructor(
    private signalRService: SignalRService,
    // private notificationClient: NotificationClient,
    // private companyClient: CompanyClient,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
    public sidebarService: SidebarService,
  ) {
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    this.subscriptions.forEach((p) => p.unsubscribe());
    this.subscriptions = [];
    this.signalRService.disconnect();
  }

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside.bind(this));
    this.signalRService.init();
    this.signalRService.connect();
    // this.initHandlers();
    // this.checkUserValid();
    // this.checkUserSubscription();
    // this.loadNotifications();
    this.currentUrl = this.router.url;

    // Subscribe to sidebar state
    this.subscriptions.push(
      this.sidebarService.getSidebarCollapsed().subscribe((collapsed) => {
        this.sidebarCollapsed = collapsed;
      }),
      this.sidebarService.getMobileSidebarOpen().subscribe((open) => {
        this.mobileSidebarOpen = open;
      })
    );
  }

  // initHandlers(): void {
  //   this.subscriptions.push(
  //     this.signalRService.getNewNotificationEvent().subscribe((p) => {
  //       this.alertService.showMessage(p.title, p.message, MessageSeverity.info);
  //       this.loadNotifications();
  //     }),
  //   );
  // }
  //
  // loadNotifications(): void {
  //   this.notificationClient
  //     .notification_GetUnReadNotificationCount()
  //     .subscribe((res) => {
  //       this.unreadCount = res.count ?? 0;
  //     });
  //   this.notificationClient
  //     .notification_GetNotifications(null, false, null, true, 1, 10, null)
  //     .subscribe((res) => {
  //       console.log('res');
  //       console.log(res);
  //       this.notifications = res.data ?? [];
  //     });
  // }
  //
  // checkUserValid(): void {
  //   this.companyClient.company_CheckUserActiveStatus().subscribe(
  //     value => {
  //       if (this.authService.isRole(RoleNames.CompanyAdmin)) {
  //         if (!value.isCompanyActive) {
  //           this.router.navigate(['/dashboard/logout']);
  //         }
  //       } else if (!this.authService.isRole(RoleNames.CompanyAdmin) && !this.authService.isRole(RoleNames.Administrator)) {
  //         if (!value.isUserActive) {
  //           this.router.navigate(['/dashboard/logout']);
  //         }
  //       }
  //     }
  //   );
  // }
  //
  // checkUserSubscription(): void {
  //   // Only check subscription for Company Admin role
  //   if (!this.authService.isRole(RoleNames.CompanyAdmin)) {
  //     return;
  //   }
  //
  //   this.companyClient.company_CheckUserSubscription().subscribe({
  //     next: (response) => {
  //       if (!response) return;
  //
  //       const subscriptionData = response;
  //
  //       // Check if subscription request is pending
  //       if (subscriptionData.hasRequested && !subscriptionData.hasSubscription) {
  //         this.router.navigate(['/subscription/pending']);
  //         return;
  //       }
  //
  //       // Check if subscription is expired
  //       if (subscriptionData.isExpired) {
  //         this.router.navigate(['/subscription/select'], {
  //           state: {
  //             isExpired: true,
  //             message: subscriptionData.message
  //           }
  //         });
  //         return;
  //       }
  //
  //       // Check if no subscription
  //       if (!subscriptionData.hasSubscription) {
  //         this.router.navigate(['/subscription/select']);
  //         return;
  //       }
  //
  //       // Has active subscription - continue normal flow
  //     },
  //   });
  // }

  isNotificationDropdownOpen = false;
  sidebarOpen = false;

  handleClickOutside(event: MouseEvent) {
    const element = document.querySelector('.relative');
    if (element && !element.contains(event.target as Node)) {
      this.isNotificationDropdownOpen = false;
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { AppSidebarComponent } from '../../shared/sidebar/components/app-sidebar.component';
//
// @Component({
//   selector: 'app-pages',
//   standalone: true,
//   templateUrl: './dashboard.component.html',
//   imports: [RouterOutlet, AppSidebarComponent],
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent { }
