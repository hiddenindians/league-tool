// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const notifyPointsAdded = async (context: HookContext) => {
  const { data, params } = context

  if (!data || !data.$push || !data.$push.bonus_codes_used) {
    return context
  }

  const bonusCode = data.$push.bonus_codes_used

  const user = params.user
  const email = user.email || ''
  
  if (email == '') {
    return context
  }

  const subject =
    `${bonusCode.points_awarded} points have been added to your account`
 

  const html = `
  <div style="font-family: sans-serif; background-color: #f8f8f8; padding: 2rem;">
    <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 2rem;">
      <img src="https://play.shopnekos.ca/neko.png" alt="Neko's Logo" style="height: 48px; display: block; margin: 0 auto 1rem;" />
      <p>Congratulations${ '&nbsp;' + user.username || ''}! <p>
      <p>${bonusCode.points_awarded} points have been added to your account </p>

      <p>Thank you for playing at Neko's. We hope you had a great time!</p>
      <p>— Neko's</p>

      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #555; text-align: left; font-size: 0.8rem; color: #999;">
        <img src="https://play.shopnekos.ca/Nekos-Web-Heading.png" alt="Neko's Header Logo" style="height: 32px; margin-bottom: 0.5rem;" /><br />
        <span style="color: #aaa; text-decoration:none"><a href="https://shopnekos.ca">shopnekos.ca</a> | <a href="mailto:hello@shopnekos.ca">hello@shopnekos.ca</a></span>
      </div>
    </div>
  </div>
`

  try {
    const message: any = {
      from: 'no-reply@play.shopnekos.ca',
      to: email,
      subject,
      html
    }
    await context.app.service('mailer').create(message)
  } catch (err) {
    console.error('Error sending points added email:', err)
  }

  return context
}
