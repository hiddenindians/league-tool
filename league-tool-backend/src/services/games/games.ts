// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  gameDataValidator,
  gamePatchValidator,
  gameQueryValidator,
  gameResolver,
  gameExternalResolver,
  gameDataResolver,
  gamePatchResolver,
  gameQueryResolver
} from './games.schema'

import type { Application, HookContext } from '../../declarations'
import { GameService, getOptions } from './games.class'
import { gamePath, gameMethods } from './games.shared'

export * from './games.class'
export * from './games.schema'

const isAdmin = async (context: HookContext) => {
  const { user } = context.params
  if (!user || user.role !== 'admin') {
    throw new Error('Only administrators can perform this action')
  }
  return context
}

// A configure function that registers the service and its hooks via `app.configure`
export const game = (app: Application) => {
  // Register our service on the Feathers application
  app.use(gamePath, new GameService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: gameMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(gamePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(gameExternalResolver),
        schemaHooks.resolveResult(gameResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(gameQueryValidator), schemaHooks.resolveQuery(gameQueryResolver)],
      find: [],
      get: [],
      create: [
        isAdmin,
        schemaHooks.validateData(gameDataValidator),
        schemaHooks.resolveData(gameDataResolver)
      ],
      patch: [
        isAdmin,
        schemaHooks.validateData(gamePatchValidator),
        schemaHooks.resolveData(gamePatchResolver)
      ],
      remove: [isAdmin]
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
    [gamePath]: GameService
  }
}
