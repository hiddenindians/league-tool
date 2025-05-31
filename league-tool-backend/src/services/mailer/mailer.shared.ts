// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Mailer, MailerData, MailerPatch, MailerQuery, MailerService } from './mailer.class'

export type { Mailer, MailerData, MailerPatch, MailerQuery }

export type MailerClientService = Pick<MailerService<Params<MailerQuery>>, (typeof mailerMethods)[number]>

export const mailerPath = 'mailer'

export const mailerMethods: Array<keyof MailerService> = ['find', 'get', 'create', 'patch', 'remove']

export const mailerClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(mailerPath, connection.service(mailerPath), {
    methods: mailerMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [mailerPath]: MailerClientService
  }
}
