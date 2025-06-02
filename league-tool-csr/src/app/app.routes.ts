import { Routes } from '@angular/router';
import { AuthComponent } from './routes/auth/auth.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { SettingsComponent } from './routes/settings/settings.component';
import { RedeemComponent } from './routes/redeem/redeem.component';
import { authGuard } from './services/guards/auth-guard.guard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { map } from 'rxjs';
import { ScorecardComponent } from './routes/scorecard/scorecard.component';
import { unauthGuard } from './services/guards/unauth.guard';
import { adminGuard } from './services/guards/admin.guard';
import { VerifyComponent } from './routes/verify/verify.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  // Login
  {
    path: 'auth/login',
    component: AuthComponent,
    data: { authType: 'login' },
    canActivate: [unauthGuard],
  },

  // Register
  {
    path: 'auth/register',
    component: AuthComponent,
    data: { authType: 'register' },
    canActivate: [unauthGuard],
  },

  // Callback (OAuth)
  {
    path: 'auth/callback',
    component: AuthComponent,
    data: { authType: 'callback' },
    canActivate: [unauthGuard],
  },

  {
    path: 'auth/verify',
    component: AuthComponent,
    data: { authType: 'verify' },
    canActivate: [unauthGuard],
  },
  {
    path: 'auth/forgot-password',
    component: AuthComponent,
    data: { authType: 'forgot' },
  },
  {
    path: 'auth/resend-verification',
    component: AuthComponent,
    data: { authType: 'resend' },
  },
  {
    path: 'verify/:code',
    component: VerifyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth/reset-password',
    component: AuthComponent,
    data: { authType: 'reset' },
  },

  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'redeem',
    component: RedeemComponent,
    canActivate: [authGuard],
  },
  {
    path: 'scorecard',
    component: ScorecardComponent,
    canActivate: [authGuard],
  },

  {
    path: 'admin',
    canActivateChild: [adminGuard],
    children: [
      {
        path: 'rewards',
        loadComponent: () =>
          import('./routes/admin/manage-rewards/manage-rewards.component').then(
            (m) => m.ManageRewardsComponent
          ),
      },
      {
        path: 'leagues',
        loadComponent: () =>
          import('./routes/admin/manage-games/manage-games.component').then(
            (m) => m.ManageGamesComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./routes/admin/manage-users/manage-users.component').then(
            (m) => m.ManageUsersComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
