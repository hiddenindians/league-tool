// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Id, NullableId, Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Game, GameData, GamePatch, GameQuery } from './games.schema'
import { ObjectId } from 'mongodb'

export type { Game, GameData, GamePatch, GameQuery }

export interface GameParams extends MongoDBAdapterParams<GameQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class GameService<ServiceParams extends Params = GameParams> extends MongoDBService<
  Game,
  GameData,
  GameParams,
  GamePatch
> {
  create(data: GameData): Promise<Game>;
  create(data: GameData[]): Promise<Game[]>;
  create(data: GameData | GameData[]): Promise<Game | Game[]>
 {
    const now = Date.now();
    
    if (Array.isArray(data)) {
      // Handle bulk creation
      const items = data.map(item => ({
        ...item,
        leagues: item.leagues?.map(league => ({
          ...league,
          _id: new ObjectId()    
        })) || [],
        createdAt: now,
        updatedAt: now
      }));
      return super.create(items as GameData[]);
    }
    
    // Handle single item creation
    const item = {
      ...data,
      leagues: data.leagues?.map(league => ({
        ...league,
        _id: new ObjectId()
      })) || [],
      createdAt: now,
      updatedAt: now
    };
    return super.create(item as GameData);
  }
  patch(id: null, data: GamePatch, params?: ServiceParams): Promise<Game[]>;
  patch(id: Id, data: GamePatch, params?: ServiceParams): Promise<Game>;
  async patch(id: NullableId, data: GamePatch, params?: ServiceParams): Promise<Game | Game[]> {
    const now = Date.now();

     // Check if we're using $push operation for leagues
     if (data.$push && data.$push.leagues) {
      // If pushing a single league
      if (!Array.isArray(data.$push.leagues)) {
        data.$push.leagues = {
          ...data.$push.leagues,
          _id: new ObjectId()
        };
      } 
      // If pushing multiple leagues using $each
      // else if (data.$push.leagues.$each) {
      //   data.$push.leagues.$each = data.$push.leagues.$each.map((league: any) => ({
      //     ...league,
      //     _id: new ObjectId()
      //   }));
      // }
    }

    const patchData = {
      ...data,
      updatedAt: now
    };
    return super.patch(id, patchData, params);
  }
}


export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('games'))
  }
}
