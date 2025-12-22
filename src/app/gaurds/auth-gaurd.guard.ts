import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { Permissions, RoleNames } from './../constants/role-names';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService,
    private alertService: AlertService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const url: string = state.url;
    var result = this.checkLogin(url, route);
    if (result == false) {
      this.navigationService.navigateByUrl('/login');
    }
    return result;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    try {
      this.alertService.startLoadingMessage();
      if (this.authService.isLoggedIn) {
        // Ensure user roles are loaded
        this.authService.reevaluateLoginStatus();

        // Get role and permission from current route and all parent routes
        let authRole: string[] | undefined;
        let authPermission: string[] | undefined;

        // Traverse up the route tree to find role/permission data
        let currentRoute: ActivatedRouteSnapshot | null = route;
        let routeLevel = 0;

        while (currentRoute) {

          // Check if this route has role data and we don't have it yet
          if (!authRole && currentRoute.data['role']) {
            authRole = currentRoute.data['role'] as string[];
          }

          // Check if this route has permission data and we don't have it yet
          if (!authPermission && currentRoute.data['permission']) {
            authPermission = currentRoute.data['permission'] as string[];
          }

          // If we found both, no need to go further up
          if (authRole && authPermission) {
            break;
          }

          // Move to parent route
          currentRoute = currentRoute.parent;
          routeLevel++;
        }

        // Debug logging

        // No role or permission restrictions - allow access
        if (!authRole && !authPermission) {
          return true;
        }

        // If user is Administrator or CompanyAdmin, allow access to any route
        // if (this.authService.isAdministrator() || this.authService.isCompanyAdmin()) {
        //   return true;
        // }

        // Check if permissions are specified
        // if (authPermission != null && authPermission.length > 0) {
        //   const hasPermission = this.authService.hasPermissions(authPermission);

        //   if (hasPermission) {
        //     return true;
        //   }
        // }

        // If no permission check or permission failed, check role
        // const hasRole = authRole == null || this.authService.isRole(authRole);

        // if (hasRole) {
        //   return true;
        // }

        return false;
      }
    } catch (e) {
      console.log('Auth guard error:', e);
    } finally {
      this.alertService.stopLoadingMessage();
    }
    this.router.navigate(['/login']);
    return false;
  }
}
