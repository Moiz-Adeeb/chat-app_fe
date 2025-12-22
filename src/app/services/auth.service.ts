import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Permissions, RoleNames } from '../constants/role-names';
import { LoginResponse } from '../models/login-response';
import { User } from '../models/user';
import { AlertService } from './alert.service';
import { Dbkey } from './db-key';
import { JwtHelper } from './jwt-helper';
import { LocalStoreManager } from './local-store-manager.service';
import { Utilities } from './utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userId?: string;
  chatId?: string;
  userName?: string;
  isVerified?: boolean;
  private _loginStatus = new Subject<boolean>();
  private previousIsLoggedInCheck = false;

  constructor(
    private localStorage: LocalStoreManager,
    private router: Router,
    private alertService: AlertService,
  ) {
    this.initializeLoginStatus();
  }

  get currentLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }

  private _currentUser?: User;

  get currentUser(): User {
    if (this._currentUser == null) {
      this._currentUser = this.localStorage.getData(Dbkey.CURRENT_USER) as User;
    }
    return this._currentUser;
  }

  refreshCurrentUser(): User {
    this._currentUser = this.localStorage.getData(Dbkey.CURRENT_USER) as User;
    return this._currentUser;
  }

  get accessToken(): string {
    return this.localStorage.getData(Dbkey.ACCESS_TOKEN);
  }

  get accessTokenExpiryDate(): Date | undefined {
    this.reevaluateLoginStatus();
    return this.localStorage.getDataObject<Date>(Dbkey.TOKEN_EXPIRES_IN, true);
  }

  get refreshAccessTokenExpiryDate(): Date | undefined {
    this.reevaluateLoginStatus();
    return this.localStorage.getDataObject<Date>(
      Dbkey.REFRESH_TOKEN_EXPIRES_IN,
      true,
    );
  }

  get isSessionExpired(): boolean {
    if (this.accessTokenExpiryDate == null) {
      return true;
    }

    return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
  }

  get idToken(): string {
    this.reevaluateLoginStatus();
    return this.localStorage.getData(Dbkey.ID_TOKEN);
  }

  get refreshToken(): string {
    this.reevaluateLoginStatus();
    return this.localStorage.getData(Dbkey.REFRESH_TOKEN);
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(Dbkey.REMEMBER_ME) === true;
  }

  public reevaluateLoginStatus(currentUser?: User): void {
    this._currentUser = currentUser || this.currentUser;
    const isLoggedIn = this._currentUser != null;
    // this.setRole();
    // if (this.previousIsLoggedInCheck !== isLoggedIn) {
    //   setTimeout(() => {
    //     this._loginStatus.next(isLoggedIn);
    //   });
    // }

    this.previousIsLoggedInCheck = isLoggedIn;
  }

  getLoginStatusEvent(): Observable<boolean> {
    return this._loginStatus.asObservable();
  }

  saveUser(user: User) {
    this.localStorage.savePermanentData(user, Dbkey.CURRENT_USER);
  }

  logout(): void {
    this.localStorage.deleteData(Dbkey.ACCESS_TOKEN);
    this.localStorage.deleteData(Dbkey.ID_TOKEN);
    this.localStorage.deleteData(Dbkey.REFRESH_TOKEN);
    this.localStorage.deleteData(Dbkey.TOKEN_EXPIRES_IN);
    this.localStorage.deleteData(Dbkey.USER_PERMISSIONS);
    this.localStorage.deleteData(Dbkey.CURRENT_USER);
    this.alertService.resetStickyMessage();
    this._currentUser = undefined;
    this.reevaluateLoginStatus();
    this.redirectLoggedInUser();
  }

  processLogin(result: LoginResponse): User | null {
    if (result.access_token == null) {
      throw new Error('Received token was empty');
    }

    // Validate JWT token format
    console.log('Login Response:', result);
    console.log('Access Token:', result.access_token);
    console.log('ID Token:', result.id_token);
    console.log('Refresh Token:', result.refresh_token);

    // const expiresIn = response.expires_in;
    const jwtHelper = new JwtHelper();
    if (result.id_token != null && result.refresh_token != null) {
      // Validate ID token format before decoding
      if (!this.isValidJWT(result.id_token)) {
        console.error('Invalid ID Token format:', result.id_token);
        throw new Error('Invalid ID Token format. Expected format: header.payload.signature');
      }

      const info = jwtHelper.decodeToken(result.id_token);
      console.log(jwtHelper.decodeToken(result.id_token));

      // Extract permissions from ObjectPermission field in ID token
      // let extractedPermissions: string[] = [];
      // const rawPermissions = info['Permission'];
      // if (Array.isArray(rawPermissions)) {
      //   extractedPermissions = rawPermissions;
      // } else if (typeof rawPermissions === 'string' && rawPermissions.length > 0) {
      //   extractedPermissions.push(rawPermissions);
      // }

      console.log('info');
      console.log(info);
      // console.log('ObjectPermission:', extractedPermissions);

      const tokenExpiryDate = new Date(0);
      tokenExpiryDate.setUTCSeconds(info.exp);

      this.saveUserDetails(
        info as User,
        result.access_token,
        result.refresh_token,
        tokenExpiryDate,
        true,
      );
      // this.localStorage.savePermanentData(extractedPermissions, Dbkey.USER_PERMISSIONS);
      // this.permissions = extractedPermissions;
      this.reevaluateLoginStatus(info as User);
      const user = info as User;
      // this.roles = [];
      // if (Array.isArray(user.roles)) {
      //   this.roles.push(...user.roles);
      // } else {
      //   this.roles.push(user.roles);
      // }
      // if (user.role != undefined) {
      //   this.roles.push(user.role);
      // }
      this.userName == user.name
      return user;
    }
    return null;
  }

  processRefreshToken(result: LoginResponse): User | null {
    if (result.access_token == null) {
      throw new Error('Received token was empty');
    }
    if (result.id_token != null && result.refresh_token != null) {
      const jwtHelper = new JwtHelper();
      const info = jwtHelper.decodeToken(result.id_token);
      const tokenExpiryDate = new Date(0);
      tokenExpiryDate.setUTCSeconds(info.exp);
      this.saveUserDetails(
        info as User,
        result.access_token,
        result.refresh_token,
        tokenExpiryDate,
        true,
      );
      this.reevaluateLoginStatus(info as User);
      const user = info as User;
      // this.roles = [];
      // if (Array.isArray(user.roles)) {
      //   this.roles.push(...user.roles);
      // } else {
      //   this.roles.push(user.roles);
      // }
      // if (user.role != undefined) {
      //   this.roles.push(user.role);
      // }
      return info as User;
    }
    return null;
  }

  redirectLoggedInUser(): void {
    this.reevaluateLoginStatus();
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Get the appropriate landing page based on user's role and permissions
    const redirect = this.getDefaultLandingPage();

    const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    const urlAndParams = Utilities.splitInTwo(
      urlParamsAndFragment.firstPart,
      '?',
    );

    const navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: 'merge',
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }

  /**
   * Gets the default landing page based on user's role and permissions
   * Priority order: Role-specific pages, then permission-based pages
   */
  private getDefaultLandingPage(): string {
    // Administrator goes to admin home
    // if (this.isRole(RoleNames.Administrator)) {
    //   return '/dashboard/admin-home';
    // }

    // CompanyAdmin goes to company home
    // if (this.isRole(RoleNames.CompanyAdmin)) {
    //   return '/dashboard/home';
    // }


    // For other roles (AdminStaff, custom roles), find first accessible page based on permissions
    // const accessibleRoutes = this.getAccessibleRoutes();

    // if (accessibleRoutes.length > 0) {
    //   return accessibleRoutes[0];
    // }
    // if (this.currentUser.role== RoleNames.Employee || this.currentUser.role== RoleNames.AdminStaff ) {
    //   return '/dashboard/employee-transactions';
    // }
    // Fallback to home if no specific route is found
    return '/chat';
  }

  /**
   * Returns list of routes the user has access to based on their permissions
   * Ordered by priority (most important pages first)
   */
  // private getAccessibleRoutes(): string[] {
  //   const routes: string[] = [];

  //   // Admin-specific routes
  //   if (this.hasPermission(Permissions.ViewAdminDashboard)) {
  //     routes.push('/dashboard/admin-home');
  //   }
  //   if (this.hasPermission(Permissions.ViewCompanies)) {
  //     routes.push('/dashboard/companies');
  //   }
  //   if (this.hasPermission(Permissions.ViewSubscriptionPlans)) {
  //     routes.push('/dashboard/subscriptions');
  //   }
  //   if (this.hasPermission(Permissions.ViewAdminStaff)) {
  //     routes.push('/dashboard/staff');
  //   }
  //   if (this.hasPermission(Permissions.ViewAdminRoles)) {
  //     routes.push('/dashboard/role');
  //   }
  //   if (this.hasPermission(Permissions.ViewNotifications)) {
  //     routes.push('/dashboard/notifications');
  //   }
  // if (this.hasPermission(Permissions.ViewPaymentHistory)) {
  //     routes.push('/dashboard/company-transactions');
  //   }


    // Company-specific routes
    // if (this.hasPermission(Permissions.ViewCompanyAdminDashboard)) {
    //   routes.push('/dashboard/home');
    // }
    // if (this.hasPermission(Permissions.ViewCompanyStaff)) {
    //   routes.push('/dashboard/staff');
    // }
    // if (this.hasPermission(Permissions.ViewBranches)) {
    //   routes.push('/dashboard/branches');
    // }
    // if (this.hasPermission(Permissions.ViewPayroll)) {
    //   routes.push('/dashboard/salary');
    // }
    // if (this.hasPermission(Permissions.ViewLoanRequests) ||
    //   this.hasPermission(Permissions.ViewOwnActiveLoans) ||
    //   this.hasPermission(Permissions.ViewOwnPendingLoans)) {
    //   routes.push('/dashboard/loan');
    // }
    // if (this.hasPermission(Permissions.ViewLoanOffers) ||
    //   this.hasPermission(Permissions.ViewAvailableOffers)) {
    //   routes.push('/dashboard/offers');
    // }
    // if (this.hasPermission(Permissions.ViewCompanyRoles)) {
    //   routes.push('/dashboard/role');
    // }
    // if (this.hasPermission(Permissions.ViewCompanyReports) ||
    //   this.hasPermission(Permissions.ViewAuditLogs)) {
    //   routes.push('/dashboard/reports');
    // }
    // if (this.hasPermission(Permissions.ViewCompanySettings) ||
    //   this.hasPermission(Permissions.ViewGlobalSettings)) {
    //   routes.push('/dashboard/settings');
    // }


    // Remove duplicates while preserving order
  //   return [...new Set(routes)];
  // }

  // isRole(role: any): boolean {
  //   if (this.roles == undefined || this.roles.length === 0) {
  //     this.reevaluateLoginStatus();
  //   }
  //   if (this.roles !== undefined) {
  //     if (Array.isArray(role)) {
  //       return this.roles.some((p) => role.indexOf(p) > -1);
  //     }
  //     return this.roles.some((p) => p === role);
  //   }
  //   return false;
  // }

  private initializeLoginStatus(): void {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  // private setRole() {
  //   if (this.currentUser == null) {
  //     return;
  //   }
  //   this.roles = [];
    // if (Array.isArray(this.currentUser.roles)) {
    //   this.roles.push(...this.currentUser.roles);
    // } else {
    //   this.roles.push(this.currentUser.roles);
    // }
    // this.roles.push(this.currentUser.role ?? '');
  // }

  private saveUserDetails(
    user: User,
    accessToken: string,
    refreshToken: string,
    expiresIn: Date,
    rememberMe: boolean,
  ) {
    console.log('user');
    console.log(user);
    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, Dbkey.ACCESS_TOKEN);
      this.localStorage.savePermanentData(expiresIn, Dbkey.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(refreshToken, Dbkey.REFRESH_TOKEN);
      this.localStorage.savePermanentData(user, Dbkey.CURRENT_USER);
    } else {
      this.localStorage.saveSyncedSessionData(accessToken, Dbkey.ACCESS_TOKEN);
      this.localStorage.saveSyncedSessionData(
        expiresIn,
        Dbkey.TOKEN_EXPIRES_IN,
      );
      this.localStorage.saveSyncedSessionData(
        refreshToken,
        Dbkey.REFRESH_TOKEN,
      );
      this.localStorage.saveSyncedSessionData(user, Dbkey.CURRENT_USER);
    }
  }

  // hasPermission(permission: string): boolean {
  //   // Administrator and CompanyAdmin have full access - bypass permission checks
  //   if (this.isRole(RoleNames.Administrator) || this.isRole(RoleNames.CompanyAdmin)) {
  //     return true;
  //   }

  //   // For other users, check their specific permissions
  //   if (!this.permissions || this.permissions.length === 0) {
  //     this.permissions = this.localStorage.getData(Dbkey.USER_PERMISSIONS) || [];
  //   }

  //   // Check if user has the specific permission in their permission list
  //   return this.permissions?.includes(permission) ?? false;
  // }

  // hasPermissions(permissions: string[]): boolean {
  //   if (!permissions || permissions.length === 0) {
  //     return true;
  //   }
  //   // User must have at least ONE of the specified permissions (OR logic)
  //   return permissions.some(p => this.hasPermission(p));
  // }

  // hasAllPermissions(permissions: string[]): boolean {
  //   if (!permissions || permissions.length === 0) {
  //     return true;
  //   }
  //   // User must have ALL specified permissions (AND logic)
  //   return permissions.every(p => this.hasPermission(p));
  // }

  // getPermissions(): string[] {
  //   if (!this.permissions || this.permissions.length === 0) {
  //     this.permissions = this.localStorage.getData(Dbkey.USER_PERMISSIONS) || [];
  //   }
  //   return this.permissions || [];
  // }

  // private isAdminPermission(permission: string): boolean {
  //   return Permissions.AllAdminPermissions.includes(permission);
  // }

  // private isCompanyPermission(permission: string): boolean {
  //   return Permissions.AllCompanyAdminPermissions.includes(permission);
  // }

  // isAdministrator(): boolean {
  //   return this.isRole(RoleNames.Administrator);
  // }

  // isCompanyAdmin(): boolean {
  //   return this.isRole(RoleNames.CompanyAdmin);
  // }

  // isEmployee(): boolean {
  //   return this.isRole(RoleNames.Employee);
  // }

  private isValidJWT(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    const parts = token.split('.');
    return parts.length === 3;
  }
}