import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUpdateSubject = new BehaviorSubject<User | null>(null);
  public userUpdates = this.userUpdateSubject.asObservable();
  
  constructor(private _feathers: FeathersService ) {}

  updateUsername(id: string, username: string){
    console.log(id)
    this._feathers.service('users').patch(id, {
      username: username
    })
  }

  updateGameStatus(id: string, gameID: string, status: boolean){
    this._feathers.service('users').patch(id, {
      gameID: gameID,
    })
  }

  updateRedeemedPoints(id: string, points: number){
    
   return this._feathers.service('users').patch(id, {
      total_redeemed: points
    })
  }
}
