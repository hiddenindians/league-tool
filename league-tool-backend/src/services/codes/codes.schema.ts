// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CodesService } from './codes.class'

// Main data model schema
export const codesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    code: Type.String(),
    redeemedBy: Type.Optional(ObjectIdSchema()),
    used: Type.Boolean({default: false}),
    createdAt: Type.Number(),
    usedAt: Type.Optional(Type.Number())

  },
  { $id: 'Codes', additionalProperties: false }
)
export type Codes = Static<typeof codesSchema>
export const codesValidator = getValidator(codesSchema, dataValidator)
export const codesResolver = resolve<Codes, HookContext<CodesService>>({})

export const codesExternalResolver = resolve<Codes, HookContext<CodesService>>({})

// Schema for creating new entries
export const codesDataSchema = Type.Pick(codesSchema, ['redeemedBy'], {
  $id: 'CodesData'
})
export type CodesData = Static<typeof codesDataSchema>
export const codesDataValidator = getValidator(codesDataSchema, dataValidator)
export const codesDataResolver = resolve<Codes, HookContext<CodesService>>({})

// Schema for updating existing entries
export const codesPatchSchema = Type.Partial(codesSchema, {
  $id: 'CodesPatch'
})
export type CodesPatch = Static<typeof codesPatchSchema>
export const codesPatchValidator = getValidator(codesPatchSchema, dataValidator)
export const codesPatchResolver = resolve<Codes, HookContext<CodesService>>({})

// Schema for allowed query properties
export const codesQueryProperties = Type.Pick(codesSchema, ['_id', 'code'])
export const codesQuerySchema = Type.Intersect(
  [
    querySyntax(codesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CodesQuery = Static<typeof codesQuerySchema>
export const codesQueryValidator = getValidator(codesQuerySchema, queryValidator)
export const codesQueryResolver = resolve<CodesQuery, HookContext<CodesService>>({})
