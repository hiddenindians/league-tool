// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  AuthManagement,
  AuthManagementData,
  AuthManagementPatch,
  AuthManagementQuery,
  AuthManagementService
} from './auth-management.class'

export type { AuthManagement, AuthManagementData, AuthManagementPatch, AuthManagementQuery }

export type AuthManagementClientService = Pick<
  AuthManagementService<Params<AuthManagementQuery>>,
  (typeof authManagementMethods)[number]
>

export const authManagementPath = 'auth-management'

export const authManagementMethods: Array<keyof AuthManagementService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const authManagementClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(authManagementPath, connection.service(authManagementPath), {
    methods: authManagementMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [authManagementPath]: AuthManagementClientService
  }
}
