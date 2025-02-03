import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
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

  public isAuthenticated = this.currentUser.pipe(map((user: any) => !!user && !! user._id));
  
  public isAdmin = this.currentUser.pipe(
    map((user: any) => user?.role === 'admin')
  );

  constructor(private _feathers: FeathersService, private router: Router) {
    this._feathers.service('users').on('patched', (user: any) => {
      const currentUser = this.currentUserSubject.value;
      if (currentUser?._id === user._id){
        this.currentUserSubject.next(user)
      }
    })
  }

  public loginWithDiscord(): void {
    window.location.href = `${this._feathers.getApiUrl()}/oauth/discord`
  }

  public handleDiscordCallback(token: string): Observable<User> {
    console.log(token)
    return from(
      this._feathers.authenticate({
        strategy: 'discord',
        code: token
      })
    ).pipe(
      map((data: any) => {
        console.log(data)
        this.setAuth({
          ...data.user,
        });
        return data.user;
      })
    );
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
    };

    return from(
      this._feathers.service('users').create(newUser) as Promise<User>
    ).pipe(switchMap(() => this.logIn(newUser)));
  }

  public logout(): void {
    this.purgeAuth();
    //void this.router.navigate(['/auth/login']);
  }

  public reauthenticate(): void {
    // Safe to use window, document, localStorage etc.
    this._feathers
      .reauthenticate({
        strategy: 'local',
        accessToken: window.localStorage.getItem('feathers-jwt') || null,
      })
      .then((data: any) => {
        this.setAuth(data.user);
      })
      .catch((err: any) => {
        this.logout();
        this.router.navigate(['/auth/login'])
      });
  }

  public setAuth(user: any): void {
    if (user && user._id) { // Add validation
      this.currentUserSubject.next(user);
    } else {
      this.currentUserSubject.next(null);
    }
  }

  public purgeAuth(): void {
    this.currentUserSubject.next(null);
  }
}
