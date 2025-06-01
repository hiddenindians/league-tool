// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Codes, CodesData, CodesPatch, CodesQuery } from './codes.schema'

export type { Codes, CodesData, CodesPatch, CodesQuery }

export interface CodesParams extends MongoDBAdapterParams<CodesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class CodesService<ServiceParams extends Params = CodesParams> extends MongoDBService<
  Codes,
  CodesData,
  CodesParams,
  CodesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('codes'))
  }
}
