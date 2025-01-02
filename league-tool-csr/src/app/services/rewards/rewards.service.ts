import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { map, Observable } from 'rxjs';
import { Reward } from '../../shared/models/reward.model';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

  constructor(private _feathers: FeathersService) { }

  getRewards(): Observable<Reward[]>{
    return this._feathers.service('rewards').watch().find({
      query: {
      $limit: 1000, //something ridiculous so that all are loaded. might want to adjust backend to just send all.
      $sort: {
        points: 1
      }}
    }).pipe(
      map((response: any) => response.data)
    );
  }

  createReward(reward: Reward) {
    return this._feathers.service('rewards').create(reward)
  }

  updateReward(id: string, reward: Partial<Reward>){
    return this._feathers.service('rewards').watch().patch(id, reward)
  }

  deleteReward(id: string){
    return this._feathers.service('rewards').remove(id)
  }
}
