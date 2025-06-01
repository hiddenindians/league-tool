// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const promoteFirstUser = async (context: HookContext) => {
  const users = await context.app.service('users').find({ paginate: false })

  if (users.length === 0) {
    context.data.role = 'admin'
  }
  return context
}
