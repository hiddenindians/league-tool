import { Routes } from '@angular/router';
import { AuthComponent } from './routes/auth/auth.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { SettingsComponent } from './routes/settings/settings.component';
import { RedeemComponent } from './routes/redeem/redeem.component';
import { authGuardGuard } from './services/guards/auth-guard.guard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { map } from 'rxjs';
import { ScorecardComponent } from './routes/scorecard/scorecard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        component: AuthComponent,
        canActivate: [
          () =>
            inject(AuthService).isAuthenticated.pipe(
              map((isAuth) => {
               return !isAuth;
              })
            ),
        ],
        data: { authType: 'register' },
      },
      {
        path: 'login',
        component: AuthComponent,
        canActivate: [
          () =>
            inject(AuthService).isAuthenticated.pipe(
              map((isAuth) => {
                console.log(isAuth)
               return !isAuth;
              })
            ),
        ],
        data: { authType: 'login' },
      },
      {
        path: 'callback',
        component: AuthComponent,
        canActivate: [
          () =>
            inject(AuthService).isAuthenticated.pipe(
              map((isAuth) => {
               return !isAuth;
              })
            ),
        ],
        data: { authType: 'callback' },
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'redeem',
    component: RedeemComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'scorecard',
    component: ScorecardComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'admin/rewards',
    loadComponent: () =>
      import('./routes/admin/manage-rewards/manage-rewards.component').then(
        (m) => m.ManageRewardsComponent
      ),
    canActivate: [() => inject(AuthService).isAdmin],
  },
  {
    path: 'admin/leagues',
    loadComponent: () =>
      import('./routes/admin/manage-leagues/manage-leagues.component').then(
        (m) => m.ManageLeaguesComponent
      ),
    canActivate: [() => inject(AuthService).isAdmin],
  },
];
