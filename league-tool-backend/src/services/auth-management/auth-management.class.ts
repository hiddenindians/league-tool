// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type AuthManagement = any
type AuthManagementData = any
type AuthManagementPatch = any
type AuthManagementQuery = any

export type { AuthManagement, AuthManagementData, AuthManagementPatch, AuthManagementQuery }

export interface AuthManagementServiceOptions {
  app: Application
}

export interface AuthManagementParams extends Params<AuthManagementQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class AuthManagementService<ServiceParams extends AuthManagementParams = AuthManagementParams>
  implements ServiceInterface<AuthManagement, AuthManagementData, ServiceParams, AuthManagementPatch>
{
  constructor(public options: AuthManagementServiceOptions) {}

  async find(_params?: ServiceParams): Promise<AuthManagement[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<AuthManagement> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: AuthManagementData, params?: ServiceParams): Promise<AuthManagement>
  async create(data: AuthManagementData[], params?: ServiceParams): Promise<AuthManagement[]>
  async create(
    data: AuthManagementData | AuthManagementData[],
    params?: ServiceParams
  ): Promise<AuthManagement | AuthManagement[]> {

    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: AuthManagementData, _params?: ServiceParams): Promise<AuthManagement> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: AuthManagementPatch, _params?: ServiceParams): Promise<AuthManagement> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<AuthManagement> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
