// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Codes, CodesData, CodesPatch, CodesQuery, CodesService } from './codes.class'

export type { Codes, CodesData, CodesPatch, CodesQuery }

export type CodesClientService = Pick<CodesService<Params<CodesQuery>>, (typeof codesMethods)[number]>

export const codesPath = 'codes'

export const codesMethods: Array<keyof CodesService> = ['find', 'get', 'create', 'patch', 'remove']

export const codesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(codesPath, connection.service(codesPath), {
    methods: codesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [codesPath]: CodesClientService
  }
}
