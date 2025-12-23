import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Permissions, RoleNames } from '../../../constants/role-names';
import { AuthService } from '../../../services/auth.service';
import { SidebarService } from '../../../services/sidebar.service';
import { SignalRService } from '../../../services/signal-r.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
  roles?: string[]; // Array of roles that can access this route. If empty/undefined, all roles can access
  permissions?: string[]; // Array of permissions required. If specified, user must have at least one of these permissions
}
interface NavSection {
  title?: string;
  items: NavItem[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, AngularSvgIconModule],
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
})
export class AppSidebarComponent implements OnInit {
  @Input() sidebarCollapsed: boolean = false; // Sidebar collapsed state
  currentLanguage: string = 'en';
  logout: NavSection[] = [];
  navSections: NavSection[] = [];
  filteredNavSections: NavSection[] = []; // Filtered based on user role
  active = true; // Set to true to show navigation items
  @Input() logoSrc = '/assets/svg/sala-logo.svg';
  window = window; // Expose window to template

  constructor(
    private router: Router,
    private translate: TranslateService,
    private sidebarService: SidebarService,
    private authService: AuthService,
    private signalRservice: SignalRService
  ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.setLanguage(saved);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    this.currentLanguage = lang;
  }

  ngOnInit(): void {
    this.initializeNav();
    // this.filterNavigationByRole();
  }

  onNavItemClick(): void {
    // Close mobile sidebar when nav item is clicked
    if (window.innerWidth < 1024) {
      this.sidebarService.closeMobileSidebar();
    }
  }

  onLogout() {
    this.signalRservice.disconnect();
    this.router.navigate(['/login']);
  }

  private initializeNav() {
    // Initialize navigation sections with permission-based access control
    // this.navSections = [
    //   {
    //     items: [
    //       // Admin Dashboard
    //       {
    //         label: 'Dashboard',
    //         icon: '/assets/svg/sidebar/dashboard-icon.svg',
    //         route: '/dashboard/admin-home',
    //         roles: [RoleNames.Administrator] ,// Admin only
    //         permissions: [Permissions.ViewAdminDashboard]
    //       },
    //       // Company/Employee Dashboard
    //       {
    //         label: 'Dashboard',
    //         icon: '/assets/svg/sidebar/dashboard-icon.svg',
    //         route: '/dashboard/home',
    //         active: true,
    //         roles: [RoleNames.CompanyAdmin, RoleNames.Employee],
    //         permissions: [Permissions.ViewCompanyAdminDashboard]
    //       },
    //       // Companies Management (Admin only)
    //       {
    //         label: 'Companies',
    //         icon: '/assets/svg/sidebar/companies-icon.svg',
    //         route: '/dashboard/companies',
    //         roles: [RoleNames.Administrator], // Admin only
    //         permissions: [Permissions.ViewCompanies]
    //       },
    //       // Branches Management (Company)
    //       {
    //         label: 'Branches',
    //         icon: '/assets/svg/sidebar/companies-icon.svg',
    //         route: '/dashboard/branches',
    //         roles: [RoleNames.CompanyAdmin, RoleNames.Employee],
    //         permissions: [Permissions.ViewBranches]
    //       },
    //       // Admin Staff Management
    //       {
    //         label: 'Staff',
    //         icon: '/assets/svg/sidebar/staff-icon.svg',
    //         route: '/dashboard/staff/admin',
    //         roles: [RoleNames.Administrator], // Admin only
    //         permissions: [Permissions.ViewAdminStaff]
    //       },
    //       // Company Staff Management
    //       {
    //         label: 'Staff',
    //         icon: '/assets/svg/sidebar/staff-icon.svg',
    //         route: '/dashboard/staff/company',
    //         roles: [RoleNames.CompanyAdmin, RoleNames.Employee],
    //         permissions: [Permissions.ViewCompanyStaff]
    //       },
    //       // Salary/Payroll Management
    //       {
    //         label: 'Salary',
    //         icon: '/assets/svg/sidebar/salary-icon.svg',
    //         route: '/dashboard/salary',
    //         roles: [RoleNames.CompanyAdmin, RoleNames.Employee],
    //         permissions: [Permissions.ViewPayroll]
    //       },
    //       // Loan Management
    //       {
    //         label: 'Loan',
    //         icon: '/assets/svg/sidebar/loan-icon.svg',
    //         route: '/dashboard/loan',
    //         roles: [RoleNames.CompanyAdmin, RoleNames.Employee],
    //         permissions: [
    //           Permissions.ViewLoanRequests,
    //           Permissions.ViewOwnActiveLoans,
    //           Permissions.ViewOwnPendingLoans
    //         ]
    //       },
    //       // Loan Offers
    //       {
    //         label: 'Offers',
    //         icon: '/assets/svg/sidebar/offers-icon.svg',
    //         route: '/dashboard/offers',
    //         roles: [RoleNames.CompanyAdmin, RoleNames.Employee],
    //         permissions: [Permissions.ViewLoanOffers, Permissions.ViewAvailableOffers]
    //       },
    //       // Subscription Plans (Admin only)
    //       {
    //         label: 'Subscriptions',
    //         icon: '/assets/svg/sidebar/subscriptions-icon.svg',
    //         route: '/dashboard/subscriptions',
    //         roles: [RoleNames.Administrator], // Admin only
    //         permissions: [Permissions.ViewSubscriptionPlans]
    //       },
    //       // Subscription Requests (Admin only)
    //       {
    //         label: 'Requests',
    //         icon: '/assets/svg/sidebar/reports-icon.svg',
    //         route: '/dashboard/subscription-requests',
    //         roles: [RoleNames.Administrator],
    //         permissions: [" "]
    //       },
    //       // Transactions (Admin only - using role for now as no specific permission exists)
    //       {
    //         label: 'Payments',
    //         icon: '/assets/svg/sidebar/transactions-icon.svg',
    //         route: '/dashboard/payments',
    //         roles: [RoleNames.Administrator],
    //         permissions: [" "]
    //       },
    //       // Company Transactions (CompanyAdmin only)
    //       {
    //         label: 'Transactions',
    //         icon: '/assets/svg/sidebar/transactions-icon.svg',
    //         route: '/dashboard/company-transactions',
    //         roles: [RoleNames.CompanyAdmin],
    //         permissions: [" "]
    //       },
    //       // Employee Transactions (Employee only)
    //       {
    //         label: 'MyTransactions',
    //         icon: '/assets/svg/sidebar/transactions-icon.svg',
    //         route: '/dashboard/employee-transactions',
    //         roles: [RoleNames.Employee,RoleNames.AdminStaff],
    //       },
    //       // Admin Roles Management
    //       {
    //         label: 'Role',
    //         icon: '/assets/svg/sidebar/role-icon.svg',
    //         route: '/dashboard/role/admin',
    //         roles: [RoleNames.Administrator], // Admin only
    //         permissions: [Permissions.ViewAdminRoles]
    //       },
    //       // Company Roles Management
    //       {
    //         label: 'Role',
    //         icon: '/assets/svg/sidebar/role-icon.svg',
    //         route: '/dashboard/role/company',
    //         roles: [RoleNames.CompanyAdmin],
    //         permissions: [Permissions.ViewCompanyRoles]
    //       },
    //       // Reports
    //       // {
    //       //   label: 'Reports',
    //       //   icon: '/assets/svg/sidebar/user-reports-icon.svg',
    //       //   route: '/dashboard/reports',
    //       //   roles: [RoleNames.Administrator, RoleNames.CompanyAdmin],
    //       //   permissions: [Permissions.ViewCompanyReports, Permissions.ViewAuditLogs]
    //       // },
    //       // Settings
    //       {
    //         label: 'Settings',
    //         icon: '/assets/svg/sidebar/settings-icon.svg',
    //         route: '/dashboard/settings',
    //       },
    //     ],
    //   },
    // ];

    // Logout section (visible to all)
    this.logout = [
      {
        title: 'exit',
        items: [
          {
            label: 'Logout',
            icon: '/assets/svg/sidebar/logout-icon.svg',
            route: '/logout'
          }
        ]
      }
    ];
  }

  /**
   * Filter navigation items based on current user's role
   */
  // private filterNavigationByRole(): void {
  //   this.filteredNavSections = this.navSections.map(section => ({
  //     ...section,
  //     items: section.items.filter(item => this.canAccessRoute(item))
  //   })).filter(section => section.items.length > 0); // Remove empty sections
  // }

  /**
   * Check if current user can access a route based on roles and permissions
   */
  // private canAccessRoute(item: NavItem): boolean {
  //   if (item.roles && item.roles.length > 0) {

  //     // User has the role - if Admin or CompanyAdmin, grant access
  //     if (this.authService.isRole(RoleNames.Administrator) || this.authService.isRole(RoleNames.CompanyAdmin)) {
  //       const hasRole = item.roles.some(role => this.authService.isRole(role));
  //       if (!hasRole) {
  //         return false; // User doesn't have required role
  //       }
  //       return true; // Admin/CompanyAdmin have full access to their role's pages
  //     }
  //   }

  //   // For other users (AdminStaff, Employee, etc.), check permissions
  //   if (item.permissions && item.permissions.length > 0) {
  //     return  item.permissions.some(permission => this.authService.hasPermission(permission));
  //   }

  //   // No specific restrictions
  //   return true;
  // }


  //   setLanguage(lang: string) {
  //   this.translate.use(lang);
  //   localStorage.setItem('lang', lang);
  //   document.documentElement.lang = lang;
  //   document.documentElement.dir = 'ltr';
  //   this.currentLanguage = lang;
  // }

  isActive(route: string): boolean {
    // You can implement router-based active state checking here
    return false;
  }
}
