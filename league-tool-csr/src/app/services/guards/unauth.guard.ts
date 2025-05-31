import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export const unauthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated.pipe(
    take(1),
    map(isAuth =>
      !isAuth
        ? true   // allow register/login when **not** authenticated
        : router.createUrlTree(['/dashboard'])
    )
  );
};