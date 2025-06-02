import { Injectable, PLATFORM_ID } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  distinctUntilChanged,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(
    map((user: any) => !!user && !!user._id)
  );

  public isAdmin = this.currentUser.pipe(
    map((user: any) => user?.role === 'admin')
  );

  public isVerified = this.currentUser.pipe(
    map((user: any) => user?.isVerified === 'true')
  );

  constructor(private _feathers: FeathersService, private router: Router) {
    this._feathers.service('users').on('patched', (user: any) => {
      const currentUser = this.currentUserSubject.value;
      if (currentUser?._id === user._id) {
        this.currentUserSubject.next(user);
      }
    });
  }

  public loginWithDiscord(): void {
    window.document.cookie =
      'feathers-oauth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.document.cookie =
      'feathers-oauth.sig=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = `${this._feathers.getApiUrl()}/oauth/discord`;
  }

  public handleDiscordCallback(token: string): Observable<User> {
    return new Observable((subscriber) => {
      this._feathers
        .authenticate({
          strategy: 'discord',
          code: token,
        })
        .then((data: any) => {
          // First set the auth
          this.setAuth(data.user);

          // Then explicitly reauthenticate to ensure state is synced
          return this._feathers.reauthenticate();
        })
        .then((data: any) => {
          this.setAuth(data.user);
          subscriber.next(data.user);
          subscriber.complete();
          this.router.navigateByUrl('/dashboard');
        })
        .catch((error: any) => {
          subscriber.error(error);
        });
    });
  }

  public logIn(credentials: {
    email: string;
    password: string;
  }): Observable<User> {
    let withStrategy = { strategy: 'local', ...credentials };
    return from(this._feathers.authenticate(withStrategy)).pipe(
      map((data: any) => {
        this.setAuth({
          // token: data.accessToken,
          ...data.user,
        });
        return data.user;
      })
    );
  }

  public signUp(userData: {
    email: string;
    password: string;
    username: string;
  }): Observable<User> {
    let newUser = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: 'player',
      games: [],
      redemptions: [],
      total_points: 0,
      total_redeemed: 0,
    };

    return from(
      this._feathers.service('users').create(newUser) as Promise<User>
    ).pipe(switchMap(() => this.logIn(newUser)));
  }

  public logout(): void {
    this._feathers
      .logout()
      .then(() => {
        this.purgeAuth();
        window.location.href = '/auth/login'; // <-- full reload
      })
      .catch((err: any) => {
        console.error('logout failed', err);
        this.purgeAuth();
        window.location.href = '/auth/login'; // <-- full reload
      });
  }

  public reauthenticate(): Promise<void> {
    // Safe to use window, document, localStorage etc.
    return new Promise((resolve, reject) => {
      this._feathers
        .reauthenticate()
        .then((data: any) => {
          this.setAuth(data.user);
          resolve();
        })
        .catch((err: any) => {
          this.logout();
          this.router.navigate(['/auth/login']);
          reject(err);
        });
    });
  }

  public setAuth(user: any): void {
    if (user && user._id) {
      // Add validation
      this.currentUserSubject.next(user);
    } else {
      this.currentUserSubject.next(null);
    }
  }

  public purgeAuth(): void {
    localStorage.removeItem('feathers-jwt');
    this.currentUserSubject.next(null);
  }

  public forgotPassword(email: string): Observable<void> {
    return this._feathers
      .service('auth-management')
      .watch()
      .create({ action: 'sendResetPwd', value: { email: email } });
  }

  public resetPassword(token: string, password: string): Observable<void> {
    return this._feathers.service('auth-management').watch().create({
      action: 'resetPwdLong',
      value: {
        token,
        password,
      },
    });
  }

  public sendVerification(email: string): Promise<void> {
    return this._feathers.service('auth-management').create({
      action: 'resendVerifySignup',
      value: {
        email,
      },
    });
  }

  public verifyToken(token: string): Observable<void> {
    return this._feathers
      .service('auth-management')
      .watch()
      .create({ action: 'verifySignupLong', value: token });
  }
}
