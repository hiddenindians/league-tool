// src/app/services/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { take, map, switchMap } from 'rxjs/operators';
import { reauth$ } from './reauth.pipe';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return reauth$().pipe(
    // once reauth completes or fails, check the flag
    switchMap(() => auth.isAuthenticated.pipe(take(1))),
    map(isAuth =>
      isAuth
        ? true
        : (router.createUrlTree(['/auth/login']) as boolean | UrlTree)
    )
  );
};