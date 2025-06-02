// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const generateQrCode = async (context: HookContext) => {
  const { data, id } = context

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

  

    context.data.generatedCode = newCodeEntry.code

    context.data.$push.redemptions.$each = context.data.$push.redemptions.$each.
      map((redemption: any) => {
        return {
          ...redemption,
          redemption_code: newCodeEntry.code
        }
      })
  } catch (err) {
    console.error('[generateQrCode] failed to create code:', err)
  }

  return context
}
