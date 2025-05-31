// src/app/services/guards/reauth.pipe.ts
import { inject } from '@angular/core';
import { from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export function reauth$() {
  const auth = inject(AuthService);
  // from() turns the Promise into an Observable
  return from(auth.reauthenticate()).pipe(
    // if token is invalid or no session, swallow the error
    catchError(() => of(null))
  );
}