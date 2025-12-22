import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService, Theme } from '../../../services/theme.service';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { AppButtonComponent } from "../../app-button/components/app-button/app-button.component";
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import {
  AppNotificationPopComponent
} from '../../app-notification-pop/components/app-notification-pop/app-notification-pop.component';
import {HasPermissionDirective} from '../../../directives/has-permission.directive';
import {Permissions} from '../../../constants/role-names';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AppButtonComponent, AppNotificationPopComponent, HasPermissionDirective],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  currentLanguage: string = 'en';
  currentTheme: Theme = 'light';
  showThemeMenu: boolean = false;
  showUserMenu: boolean = false;
  currentUrl: string = '';
  sidebarCollapsed: boolean = false;

  // User data - will be populated from AuthService
  userFullName: string = 'User';
  userRole: string = 'Guest';
  userAvatar: string = '/assets/img/person-image.png';

  notificationCount: number = 3;
  messageCount: number = 5;

  constructor(
    private translate: TranslateService,
    public themeService: ThemeService,
    public sidebarService: SidebarService,
    protected router: Router,
    public authService: AuthService
  ) {
    this.currentLanguage = localStorage.getItem('lang') || 'en';
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit(): void {
    // Initialize component
    this.currentUrl = this.router.url;

    // Load user information
    this.loadUserInfo();

    // Subscribe to sidebar collapsed state
    this.sidebarService.getSidebarCollapsed().subscribe(collapsed => {
      this.sidebarCollapsed = collapsed;
    });

    // Subscribe to login status changes to update user info when user logs in/out
    this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadUserInfo();
      } else {
        this.resetUserInfo();
      }
    });
  }

  /**
   * Load current user information from AuthService
   */
  private loadUserInfo(): void {
    const currentUser: User = this.authService.currentUser;

    if (currentUser) {
      // Construct full name
      this.userFullName = currentUser.fullName || currentUser.email || 'User';

      // Get user role
      this.userRole = currentUser.role || 'Guest';

      // Get user avatar (use profilePicture if available, otherwise default)
      this.userAvatar = currentUser.image || '/assets/img/person-image.png';

      console.log('Header - User Info Loaded:', {
        fullName: this.userFullName,
        role: this.userRole,
        avatar: this.userAvatar
      });
    } else {
      this.resetUserInfo();
    }
  }

  /**
   * Reset user info to defaults (when logged out)
   */
  private resetUserInfo(): void {
    this.userFullName = 'Guest';
    this.userRole = 'Guest';
    this.userAvatar = '/assets/img/person-image.png';
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    this.currentLanguage = lang;
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
    this.showThemeMenu = false;
  }

  toggleThemeMenu() {
    this.showThemeMenu = !this.showThemeMenu;
    if (this.showThemeMenu) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showThemeMenu = false;
    }
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'fa-sun';
      case 'dark':
        return 'fa-moon';
      case 'system':
        return 'fa-desktop';
      default:
        return 'fa-sun';
    }
  }

  onNotifications() {
    // Navigate to notifications
    console.log('Show notifications');
  }

  onMessages() {
    // Navigate to messages
    console.log('Show messages');
  }

  onProfile() {
    this.showUserMenu = false;
    // Navigate to profile
    console.log('Navigate to profile');
  }

  onSettings() {
    this.showUserMenu = false;
    // Navigate to settings
    this.router.navigate(['/dashboard/settings']);
  }

  onLogout() {
    this.showUserMenu = false;
    this.router.navigate(['/dashboard/logout']);
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleMobileSidebar() {
    this.sidebarService.toggleMobileSidebar();
  }

  onBack() {
    this.router.navigate(['/admin-dashboard/companies']);
  }

  protected readonly Permissions = Permissions;
}
