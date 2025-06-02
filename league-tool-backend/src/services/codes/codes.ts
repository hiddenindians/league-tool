// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  codesDataValidator,
  codesPatchValidator,
  codesQueryValidator,
  codesResolver,
  codesExternalResolver,
  codesDataResolver,
  codesPatchResolver,
  codesQueryResolver
} from './codes.schema'

import type { Application, HookContext } from '../../declarations'
import { CodesService, getOptions } from './codes.class'
import { codesPath, codesMethods } from './codes.shared'
import { randomBytes } from 'crypto'
import { generateUniqueCode } from '../../hooks/generate-unique-code'

export * from './codes.class'
export * from './codes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const codes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(codesPath, new CodesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: codesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(codesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(codesExternalResolver),
        schemaHooks.resolveResult(codesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(codesQueryValidator), schemaHooks.resolveQuery(codesQueryResolver)],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(codesDataValidator),
        schemaHooks.resolveData(codesDataResolver),
        generateUniqueCode
      ],
      patch: [
        schemaHooks.validateData(codesPatchValidator),
        schemaHooks.resolveData(codesPatchResolver),
        async (context: HookContext) => {
          if (context.data.used === true) {
            context.data.usedAt = new Date()
          }
        }
      ],
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
    [codesPath]: CodesService
  }
}
