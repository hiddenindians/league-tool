// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  rewardDataValidator,
  rewardPatchValidator,
  rewardQueryValidator,
  rewardResolver,
  rewardExternalResolver,
  rewardDataResolver,
  rewardPatchResolver,
  rewardQueryResolver
} from './rewards.schema'

import type { Application, HookContext } from '../../declarations'
import { RewardService, getOptions } from './rewards.class'
import { rewardPath, rewardMethods } from './rewards.shared'

export * from './rewards.class'
export * from './rewards.schema'

const isAdmin = async (context: HookContext) => {
  const { user } = context.params
  if (!user || user.role !== 'admin'){
    throw new Error('Only administrators can perform this action')
  }
  return context
}

// A configure function that registers the service and its hooks via `app.configure`
export const reward = (app: Application) => {
  // Register our service on the Feathers application
  app.use(rewardPath, new RewardService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: rewardMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(rewardPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(rewardExternalResolver),
        schemaHooks.resolveResult(rewardResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(rewardQueryValidator), schemaHooks.resolveQuery(rewardQueryResolver)],
      find: [],
      get: [],
      create: [isAdmin, schemaHooks.validateData(rewardDataValidator), schemaHooks.resolveData(rewardDataResolver)],
      patch: [isAdmin, schemaHooks.validateData(rewardPatchValidator), schemaHooks.resolveData(rewardPatchResolver)],
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
    [rewardPath]: RewardService
  }
}
