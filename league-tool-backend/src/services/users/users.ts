// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { iff, isProvider } from 'feathers-hooks-common'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver
} from './users.schema'

import type { Application, HookContext } from '../../declarations'
import { UserService, getOptions } from './users.class'
import { userPath, userMethods } from './users.shared'
import { preventDuplicateEmails } from '../../hooks/prevent-duplicate-emails'
import { preventDuplicateUsername } from '../../hooks/prevent-duplicate-username'
import { addVerification, removeVerification } from 'feathers-authentication-management'
import notifier from '../auth-management/notifier'
import { castObjectIdFields } from '../../hooks/cast-object-id-fields'
import { promoteFirstUser } from '../../hooks/promote-first-user'
import { preventDuplicateBonusCode } from '../../hooks/prevent-duplicate-bonus-code'
import { notifyUserRedemption } from '../../hooks/notify-user-redemption'
import { generateQrCode } from '../../hooks/generate-qr-code'
import { notifyPointsAdded } from '../../hooks/notify-points-added'
import crypto from 'crypto'
export * from './users.class'
export * from './users.schema'

// Helper predicate: “true if this create call is *not* coming from Discord OAuth”
const isLocalSignup = (context: HookContext) => {
  // 1) No discordId in the incoming data…
  if (context.data.discordId) {
    return false
  }
  // 2) And either there’s no authentication params,
  //    or the strategy isn’t ‘discord’
  const strategy = context.params?.authentication?.strategy
  return strategy !== 'discord'
}

const addGravatar = () => {
  return async (context: HookContext) => {
    const { data } = context
    if (!data.avatar && data.email) {
      const email = data.email.trim().toLowerCase()
      const hash = crypto.createHash('md5').update(email).digest('hex')
      data.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon&r=PG`
    }
    return context
  }
}

const sendVerify = () => {
  return async (context: HookContext) => {
    const notifiy = notifier(context.app)

    const users = Array.isArray(context.result) ? context.result : [context.result]

    await Promise.all(
      users.map(async (user) => {
        notifiy('resendVerifySignup', user)
      })
    )
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app: Application) => {
  // Register our service on the Feathers application
  app.use(userPath, new UserService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(userPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(userExternalResolver), schemaHooks.resolveResult(userResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
      find: [],
      get: [],
      create: [
        addGravatar(),
        preventDuplicateUsername,
        preventDuplicateEmails,
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver),
        castObjectIdFields(['applied_by', 'game_id', 'reward_id']),
        promoteFirstUser,
        iff(isLocalSignup, addVerification('auth-management'))
      ],
      patch: [
        generateQrCode,
        preventDuplicateBonusCode,
        castObjectIdFields(['applied_by', 'game_id', 'reward_id']),
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      create: [iff(isLocalSignup, sendVerify(), removeVerification())],
      patch: [notifyPointsAdded, notifyUserRedemption]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [userPath]: UserService
  }
}
