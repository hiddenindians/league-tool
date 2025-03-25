// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { GameService } from './games.class'

// Main data model schema
export const gameSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String(),
    active: Type.Boolean(),
    leagues: Type.Array(Type.Object({
      _id: ObjectIdSchema(),
      name: Type.String(),
      active: Type.Boolean(),
      seasons: Type.Array(Type.Object({
        seasonNumber: Type.Number(),
        startDate: Type.Number(),
        endDate: Type.Number(),
        active: Type.Boolean(),
        meetingDays: Type.Array(Type.String()),
        numberOfRounds: Type.Number(),
        weeksPerRound: Type.Number(),
        seasonScorecard: Type.Object({
          name: Type.String(),
          achievements: Type.Array(Type.Object({
            name: Type.String(),
            value: Type.Number(),
            description: Type.String()
          }))
        }),
        rounds: Type.Array(Type.Object({
          round_number: Type.Number(),
          start_date: Type.Number(),
          end_date: Type.Number(),
          scorecard: Type.Object({
            name: Type.String(),
            achievements: Type.Array(Type.Object({
              name: Type.String(),
              value: Type.Number(),
              description: Type.String()
            }))
          }),
          active: Type.Boolean()
        })),
      })),
    })),
    createdAt: Type.Number(),
    updatedAt: Type.Number()
  },
  { $id: 'Game', additionalProperties: false }
)
export type Game = Static<typeof gameSchema>
export const gameValidator = getValidator(gameSchema, dataValidator)
export const gameResolver = resolve<Game, HookContext<GameService>>({})

export const gameExternalResolver = resolve<Game, HookContext<GameService>>({})

// Schema for creating new entries
export const gameDataSchema = Type.Pick(gameSchema, ['name', 'active', 'leagues'], {
  $id: 'GameData'
})
export type GameData = Static<typeof gameDataSchema>
export const gameDataValidator = getValidator(gameDataSchema, dataValidator)
export const gameDataResolver = resolve<Game, HookContext<GameService>>({})

// Schema for updating existing entries
export const gamePatchSchema = Type.Partial(Type.Object({
  ...Type.Partial(gameSchema).properties,
  $push: Type.Optional(Type.Object({
    leagues: Type.Object({}) // Define the structure of what can be pushed
  })),
  $pull: Type.Optional(Type.Object({
    leagues: Type.Object({}) 
  }))
}), {
  $id: 'GamePatch'
})
export type GamePatch = Static<typeof gamePatchSchema>
export const gamePatchValidator = getValidator(gamePatchSchema, dataValidator)
export const gamePatchResolver = resolve<Game, HookContext<GameService>>({})

// Schema for allowed query properties
export const gameQueryProperties = Type.Pick(gameSchema, ['_id', 'name'])
export const gameQuerySchema = Type.Intersect(
  [
    querySyntax(gameQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type GameQuery = Static<typeof gameQuerySchema>
export const gameQueryValidator = getValidator(gameQuerySchema, queryValidator)
export const gameQueryResolver = resolve<GameQuery, HookContext<GameService>>({})
