// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RewardService } from './rewards.class'

// Main data model schema
export const rewardSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    title: Type.String(),
    points: Type.Number(),
    description: Type.String(),
    type: Type.String(),
    active: Type.Boolean(),
    createdAt: Type.Number(),
    updatedAt: Type.Number()
  },
  { $id: 'Reward', additionalProperties: false }
)
export type Reward = Static<typeof rewardSchema>
export const rewardValidator = getValidator(rewardSchema, dataValidator)
export const rewardResolver = resolve<Reward, HookContext<RewardService>>({})

export const rewardExternalResolver = resolve<Reward, HookContext<RewardService>>({})

// Schema for creating new entries
export const rewardDataSchema = Type.Pick(rewardSchema, ['title', 'points', 'description', 'type', 'active'], {
  $id: 'RewardData'
})
export type RewardData = Static<typeof rewardDataSchema>
export const rewardDataValidator = getValidator(rewardDataSchema, dataValidator)
export const rewardDataResolver = resolve<Reward, HookContext<RewardService>>({})

// Schema for updating existing entries
export const rewardPatchSchema = Type.Partial(rewardSchema, {
  $id: 'RewardPatch'
})
export type RewardPatch = Static<typeof rewardPatchSchema>
export const rewardPatchValidator = getValidator(rewardPatchSchema, dataValidator)
export const rewardPatchResolver = resolve<Reward, HookContext<RewardService>>({})

// Schema for allowed query properties
export const rewardQueryProperties = Type.Pick(rewardSchema, ['_id', 'title', 'active'])
export const rewardQuerySchema = Type.Intersect(
  [
Type.Object({
  $limit: Type.Optional(Type.Number()),
  $sort: Type.Optional(
    Type.Object({
      points: Type.Optional(Type.Number()),
    })
  ),
}) ,   // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type RewardQuery = Static<typeof rewardQuerySchema>
export const rewardQueryValidator = getValidator(rewardQuerySchema, queryValidator)
export const rewardQueryResolver = resolve<RewardQuery, HookContext<RewardService>>({})
