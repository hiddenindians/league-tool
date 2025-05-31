// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UserService } from './users.class'
import { isVerified } from 'feathers-authentication-management'

// Main data model schema
export const userSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    discordId: Type.Optional(Type.String()),
    email: Type.String(),
    password: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String()),
    role: Type.Union([Type.Literal('admin'), Type.Literal('player')]),
    total_points: Type.Optional(Type.Number()),
    total_redeemed: Type.Optional(Type.Number()),
    games: Type.Array(
      Type.Object({
        name: Type.String(),
        playing: Type.Boolean(),
        points_earned: Type.Number()
      })
    ),
    redemptions: Type.Array(
      Type.Object({
        reward_id: Type.Optional(ObjectIdSchema()),
        reward: Type.String(),
        points_redeemed: Type.Number(),
        date: Type.Number()
      })
    ),
    bonus_codes_used: Type.Array(
      Type.Object({
        code: Type.String(),
        points_awarded: Type.Number(),
        date: Type.Number(),
        source: Type.String(),
        applied_by: Type.Optional(ObjectIdSchema()),
        game_id: Type.Optional(ObjectIdSchema())
      })
    ),

    first_run: Type.Boolean({ default: true }),
    isVerified: Type.Boolean({ default: false }),
    verifyToken: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    verifyShortToken: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    verifyExpires: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    verifyChanges: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Any()])),
    resetExpires: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    resetAttempts: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    resetToken: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    resetShortToken: Type.Optional(Type.Union([Type.String(), Type.Null()]))
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext<UserService>>({})

export const userExternalResolver = resolve<User, HookContext<UserService>>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(
  userSchema,
  [
    'email',
    'password',
    'discordId',
    'username',
    'avatar',
    'role',
    'games',
    'redemptions',
    'total_points',
    'total_redeemed'
  ],
  {
    $id: 'UserData'
  }
)
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(
  Type.Object({
    ...Type.Partial(userSchema).properties,
    $push: Type.Optional(
      Type.Object({
        redemptions: Type.Optional(
          Type.Object({
            reward_id: Type.Optional(ObjectIdSchema()),
            reward: Type.Optional(Type.String()),
            points_redeemed: Type.Optional(Type.Number()),
            date: Type.Optional(Type.Number())
          })
        ), // Keep this if still used
        bonus_codes_used: Type.Optional(
          Type.Object({
            code: Type.String(),
            points_awarded: Type.Number(),
            date: Type.Number(),
            source: Type.Optional(Type.String()),
            applied_by: Type.Optional(ObjectIdSchema()),
            game_id: Type.Optional(ObjectIdSchema())
          })
        )
      })
    )
  }),
  { $id: 'UserPatch' }
)
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, [
  '_id',
  'email',
  'username',
  'discordId',
  'role',
  'verifyToken',
  'resetExpires',
  'bonus_codes_used'
])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  _id: async (value, user, context) => {
    if (context.params.user && context.params.user.role != 'admin') {
      return context.params.user._id
    }

    return value
  }
})
