// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type Mailer = any
type MailerData = any
type MailerPatch = any
type MailerQuery = any

export type { Mailer, MailerData, MailerPatch, MailerQuery }

export interface MailerServiceOptions {
  app: Application
}

export interface MailerParams extends Params<MailerQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class MailerService<ServiceParams extends MailerParams = MailerParams>
  implements ServiceInterface<Mailer, MailerData, ServiceParams, MailerPatch>
{
  constructor(public options: MailerServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Mailer[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Mailer> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: MailerData, params?: ServiceParams): Promise<Mailer>
  async create(data: MailerData[], params?: ServiceParams): Promise<Mailer[]>
  async create(data: MailerData | MailerData[], params?: ServiceParams): Promise<Mailer | Mailer[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: MailerData, _params?: ServiceParams): Promise<Mailer> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: MailerPatch, _params?: ServiceParams): Promise<Mailer> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Mailer> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
