// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const generateQrCode = async (context: HookContext) => {
  const { data, params, id } = context

  if (!data || !data.$push || !data.$push.redemptions) {
    return context
  }

  try {
    const newCodeEntry: any = await context.app.service('codes').create(
      {
        redeemedBy: id
      },
      {
        user: context.params.user
      }
    )

    if (!context.result) {
      context.result = {}
    }

    context.data.generatedCode = newCodeEntry.code
  } catch (err) {
    console.error('[generateQrCode] failed to create code:', err)
  }

  return context
}
