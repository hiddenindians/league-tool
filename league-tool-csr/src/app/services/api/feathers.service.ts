import {
  ApplicationRef,
  inject,
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { io } from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import { rx } from 'feathers-reactive';
import {environment} from '../../../../src/environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FeathersService {
  private _feathers: any;
  private apiUrl = environment.production
    ? 'https://play-api.shopnekos.ca'
    : 'http://localhost:3040';

  constructor(  private http: HttpClient) {
    const socket = environment.production ? io('https://play-api.shopnekos.ca') : io('http://localhost:3040');

    this._feathers = feathers();
    this._feathers.configure(socketio(socket));
    this._feathers.configure(authentication({ storage: window.localStorage }));
    this._feathers.configure(
      rx({
        idField: '_id',
      })
    );
  }

  public service(serviceName: string) {
    return this._feathers.service(serviceName);
  }

  public authenticate(credentials: {
    strategy: string;
    email?: string;
    password?: string;
    code?: string;
  }) {
    return this._feathers.authenticate(credentials);
  }

  public reauthenticate(credentials?: {
    strategy: string;
    accessToken: string | null;
  }) {
    return this._feathers.reAuthenticate(credentials);
  }

  public logout() {
        const jwt = localStorage.getItem('feathers-jwt');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);

    return this.http
      .delete(`${this.apiUrl}/authentication`, { headers, withCredentials: true, observe: 'response'})
      .toPromise()
      .then((res: any)=>{
      //  return this._feathers.logout();
        console.log('Response Headers:', res.headers);

      
      })
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }
}
