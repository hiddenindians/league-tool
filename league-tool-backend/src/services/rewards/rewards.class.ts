// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Reward, RewardData, RewardPatch, RewardQuery } from './rewards.schema'

export type { Reward, RewardData, RewardPatch, RewardQuery }

export interface RewardParams extends MongoDBAdapterParams<RewardQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class RewardService<ServiceParams extends Params = RewardParams> extends MongoDBService<
  Reward,
  RewardData,
  RewardParams,
  RewardPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('rewards'))
  }
}
