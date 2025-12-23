import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions, RoleNames, } from '../constants/role-names';
import { AuthGuard } from '../gaurds/auth-gaurd.guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login-routing.module').then(
            (p) => p.LoginRoutingModule,
          ),
        pathMatch: 'full',
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./forgot-password/forgot-password-routing.module').then(
            (p) => p.ForgotPasswordRoutingModule,
          ),
        pathMatch: 'full',
      },
      {
        path: 'verify-otp',
        loadChildren: () =>
          import('./verify-otp/verify-otp-routing.module').then(
            (p) => p.VerifyOtpRoutingModule,
          ),
        pathMatch: 'full',
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('./reset-password/reset-password-routing.module').then(
            (p) => p.ResetPasswordRoutingModule,
          ),
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import('./sign-up/sign-up-routing.module').then(
            (p) => p.SignUpRoutingModule,
          ),
      },
      {
        path: 'not-found',
        loadChildren: () =>
          import('./not-found/not-found-routing.module').then(
            (p) => p.NotFoundRoutingModule,
          ),
        pathMatch: 'prefix',
      },
      // {
      //   path: 'subscription',
      //   loadChildren: () =>
      //     import('./subscription/subscription-routing.module').then(
      //       (p) => p.SubscriptionRoutingModule,
      //     ),
      //   pathMatch: 'prefix',
      //   canActivateChild: [AuthGuard],
      // },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat-routing.module').then(
            (p) => p.ChatRoutingModule,
          ),
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: {
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
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
export class PagesRoutingModule {}
