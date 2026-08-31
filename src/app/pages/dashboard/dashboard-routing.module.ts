import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleNames, } from '../../constants/role-names';
import { AuthGuard } from '../../gaurds/auth-gaurd.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home-routing.module').then(
            (p) => p.HomeRoutingModule,
          ),
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: {}
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user-routing.module').then(
            (p) => p.UserRoutingModule,
          ),
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: { role: [RoleNames.SuperAdmin, RoleNames.Administrator, RoleNames.Manager, RoleNames.Tester] }
      },
      {
        path: 'log',
        loadChildren: () =>
          import('./log/log-routing.module').then(
            (p) => p.LogRoutingModule,
          ),
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: { role: [RoleNames.SuperAdmin, RoleNames.Tester] }
      },
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'login',
      // },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
