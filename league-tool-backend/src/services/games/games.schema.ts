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
    password: Type.String(),
    season: Type.Number(),
    round: Type.Number(),
    week: Type.Number(),
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
export const gameDataSchema = Type.Pick(gameSchema, ['name', 'season', 'round', 'week', 'updatedAt', 'createdAt'], {
  $id: 'GameData'
})
export type GameData = Static<typeof gameDataSchema>
export const gameDataValidator = getValidator(gameDataSchema, dataValidator)
export const gameDataResolver = resolve<Game, HookContext<GameService>>({})

// Schema for updating existing entries
export const gamePatchSchema = Type.Partial(gameSchema, {
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
