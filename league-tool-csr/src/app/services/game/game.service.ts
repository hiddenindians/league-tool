import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { map, Observable } from 'rxjs';
import {
  Game,
  League,
  Scorecard,
  Season,
} from '../../shared/models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private _feathers: FeathersService) {}

  createGame(game: any) {
    return this._feathers.service('games').create({
      name: game.name,
      active: game.active,
      leagues: game.leagues,
    });
  }

  patch(id: string, patchBody: any): Promise<Game> {
    return this._feathers.service('games').patch(id, patchBody);
  }

  getGame(gameId: string){
    return this._feathers
    .service('games')
    .watch()
    .find({
      query: {
        _id: gameId
      }
    })
    .pipe(map((response: any) => response.data));
  }
  getGames(): Observable<Game[]> {
    return this._feathers
      .service('games')
      .watch()
      .find()
      .pipe(map((response: any) => response.data));
  }

  setPassword(gameId: string, password: string) {
    return this._feathers.service('games').patch(gameId, {
      password: password,
    });
  }

  async addLeague(gameId: string, leagueData: Partial<League>):Promise<Game> {
    return this._feathers.service('games').patch(gameId, {
      $push: { leagues: leagueData },
    });
  }

  async deleteLeague(gamedId: string, leagueId: string) {
    return this._feathers.service('games').patch(gamedId, {
      $pull: { leagues: { _id: leagueId } },
    });
  }

  async addSeason(
    gameId: string,
    leagueId: string,
    seasonData: Partial<Season>
  ) {
    // Add season implementation
  }

  async updateScorecard(
    gameId: string,
    leagueId: string,
    seasonId: string,
    scorecard: Scorecard
  ) {
    // Update scorecard implementation
  }
}
