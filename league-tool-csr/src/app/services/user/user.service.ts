import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUpdateSubject = new BehaviorSubject<User | null>(null);
  public userUpdates = this.userUpdateSubject.asObservable();

  constructor(private _feathers: FeathersService) {}

  updateUsername(id: string, username: string) {
    console.log(id);
    this._feathers.service('users').patch(id, {
      username: username,
    });
  }

  updateGameStatus(id: string, gameID: string, status: boolean) {
    this._feathers.service('users').patch(id, {
      gameID: gameID,
    });
  }

  addToTotalPoints(id: string, amount: number){
    console.log(id, ' ', amount)
    return this._feathers.service('users').patch(id, {
      $inc: { total_points: amount }
    })
  }

  updateBonusCodesUsed(id: string, code: string, points: number, source: string, gameId: string, applied_by: string){
    return this._feathers.service('users').patch(id, {
      $push: {
        bonus_codes_used: {
          code: code,
          points_awarded: points,
          date: Date.now(),
          source: source,
          game_id: gameId,
          applied_by: applied_by
        }
      }
    })
  }

  updateRedeemedPoints(id: string, points: number) {
    return this._feathers.service('users').patch(id, {
      total_redeemed: points,
    });
  }

  updateRedemptionLog(id: string, redemptions: Set<any>) {
    const array = Array.from(redemptions).map((reward) => {
      const {points, title} = reward
      return {
        reward_id: reward._id,
        reward: title,
        points_redeemed: points,
        date: Date.now()
      }
    })
    return this._feathers.service('users').patch(id, {
      $push: {
        redemptions: {
          $each: array,
        },
      },
    });
  }
}
