import { HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

export const preventDuplicateBonusCode = async (context: HookContext) => {
  const {data, app } = context
  const user = context.arguments[0]
  console.log(data.$push)
  // Only run this logic if we're pushing to the bonus_codes_used array
  if (!data.$push || !data.$push.bonus_codes_used || !data.$push.bonus_codes_used.code) {
    return context
  }


  const newCode = data.$push.bonus_codes_used.code
  const existingUser = await app.service('users').find({ query: { _id: user as string }, paginate: false })
  const alreadyUsed = existingUser[0].bonus_codes_used?.some((entry: any) => entry.code === newCode)

  if (alreadyUsed) {
    throw new BadRequest('You have already used this bonus code.')
  }

  return context
}
