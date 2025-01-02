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
  private currentUserSubject = new BehaviorSubject<User | null>({} as User);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user: any) => !!user));
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
    void this.router.navigate(['/login']);
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
      });
  }

  public setAuth(user: any): void {
    this.currentUserSubject.next(user);
  }

  public purgeAuth(): void {
    this.currentUserSubject.next(null);
  }
}
