import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { map, Observable } from 'rxjs';
import { Game } from '../../shared/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _feathers: FeathersService) { }

  createGame(game: any){
    return this._feathers.service('games').create(
      {
        name: game.name,
        active: game.active,
        leagues: game.leagues
      }
    )
  }

  patch(id: string, patchBody: any): Game {
    return this._feathers.service('games').patch(id, patchBody)

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
