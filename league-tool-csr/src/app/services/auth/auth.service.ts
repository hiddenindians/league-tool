import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  from,
  map,
  Observable,
  switchMap,
  take,
  tap,
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

  constructor(private _feathers: FeathersService, private router: Router) {
    this._feathers.service('users').on('patched', (user: any) => {
      const currentUser = this.currentUserSubject.value;
      if (currentUser?._id === user._id) {
        this.currentUserSubject.next(user);
      }
    });
  }

  public loginWithDiscord(): void {
    window.location.href = `${this._feathers.getApiUrl()}/oauth/discord`;
  }

  public handleDiscordCallback(token: string): Observable<User> {
    return new Observable(subscriber => {
      this._feathers.authenticate({
        strategy: 'discord',
        code: token
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
        this.router.navigateByUrl('/dashboard')
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
    };

    return from(
      this._feathers.service('users').create(newUser) as Promise<User>
    ).pipe(switchMap(() => this.logIn(newUser)));
  }

  public logout(): void {
    this.purgeAuth();
    //void this.router.navigate(['/auth/login']);
  }

  public reauthenticate(): Promise<void> {
    // Safe to use window, document, localStorage etc.
    return new Promise((resolve, reject) => {
      this._feathers
        .reauthenticate(
          //{
          // strategy: 'local',
          // accessToken: window.localStorage.getItem('feathers-jwt') || null,
      //  }
      )
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
    this.currentUserSubject.next(null);
  }
}
