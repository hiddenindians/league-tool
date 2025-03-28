import { ApplicationRef, inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io } from 'socket.io-client'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client'
import { rx } from 'feathers-reactive'

@Injectable({
  providedIn: 'root'
})
export class FeathersService {
  private _feathers: any;
  private apiUrl = 'http://localhost:3040'

  constructor() {
    const socket = io('http://localhost:3040');

    this._feathers = feathers();
    this._feathers.configure(socketio(socket))
    this._feathers.configure(authentication({storage: window.localStorage}))
    this._feathers.configure(rx({
      idField: '_id'
    }))
   }

   public service(serviceName: string){
    return this._feathers.service(serviceName)
   }

   public authenticate(credentials: {strategy: string, email?: string, password?: string, code?: string}){
    return this._feathers.authenticate(credentials)
   }

   public reauthenticate(credentials?: {strategy: string, accessToken: string | null}){
    return this._feathers.reAuthenticate(credentials)
   }

   public logout() {
    return this._feathers.logout()
   }

   public getApiUrl(): string {
    return this.apiUrl;
   }




  }





