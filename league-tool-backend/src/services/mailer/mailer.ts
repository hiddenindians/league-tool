// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { MailerService, getOptions } from './mailer.class'
import { mailerPath, mailerMethods } from './mailer.shared'
import Mailer from 'feathers-mailer'

export * from './mailer.class'

// A configure function that registers the service and its hooks via `app.configure`
export const mailer = async (app: Application) => {
 // const account = await nodemailer.createTestAccount() // internet required
const account = {
  smtp: {
  host: 'smtp.mailgun.org',
  port: 465,
  secure: 'SSL'
  } 
}
  const cfg = app.get('mailgun'); 

  const transport = {
    host: cfg.host,
    port: cfg.port,
   // secure: account.smtp.secure, // 487 only
   // requireTLS: true,
    auth: {
      user: cfg.user,
      pass: cfg.pass
    }
  }

  const defaults = {
    from: `League Tool`
  }

  // Register our service on the Feathers application
  app.use(mailerPath, new (Mailer as any)(transport, defaults))

  // Initialize hooks
  app.service(mailerPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [mailerPath]: MailerService
  }
}
