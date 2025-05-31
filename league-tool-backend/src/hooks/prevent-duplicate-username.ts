// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '../declarations'

export const preventDuplicateUsername = async (context: HookContext) => {
 const { data, app } = context
 const username = (data.username as string || '').trim().toLowerCase();
 
 if (username){
  const existing = await app.service('users').find({
    query: {
      username: username
    },
    paginate: false
  })

  if(Array.isArray(existing) && existing.length > 0) {
    throw new BadRequest('A user with that username already exists')
  }
 }
 return context
}
