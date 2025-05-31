import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { reauth$ } from './reauth.pipe';
import { map, switchMap, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService)

  return reauth$().pipe(
    switchMap(() => auth.isAdmin.pipe(take(1))),
    map((isAdmin: any) =>
      isAdmin
        ? true
        : (router.createUrlTree(['/dashboard']) as boolean | UrlTree)
    )
    
  )
};
