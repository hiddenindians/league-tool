import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { map, Observable } from 'rxjs';
import { Game } from '../../shared/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _feathers: FeathersService) { }

  createGame(name: string, season: number){
    return this._feathers.service('games').create(
      {
        name: name,
        season: season,
        round: 1,
        week: 1
      }
    )
  }

  getGames(): Observable<Game[]>{
    return this._feathers.service('games').watch().find().pipe(
      map((response: any) => response.data) 
    )
  }

  setPassword(gameId: string, password: string){
    return this._feathers.service('games').patch(gameId, {
      password: password
    })
  }
}
