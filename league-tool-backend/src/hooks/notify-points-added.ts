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
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Points Added To Your Account</title>
</head>
<body style="margin:0; padding:0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width:320px;">
    <tr>
      <td align="center" style="padding:16px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="90%" style="max-width:500px; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
          <tr>
            <td align="left">
              <img src="https://play.shopnekos.ca/neko_nobg.png" alt="Neko's Logo" width="72" height="72" style="filter:invert(0) !important; mix-blend-mode:normal !important; display:block; border:none; outline:none;" />
            </td>
          </tr>
          <tr>
            <td  padding-top:16px;" align="left">
              <h1 style="font-weight:bold;">${bonusCode.points_awarded} points have been added to your account </h1>
            </td>
          </tr>
          <tr>
            <td align="left">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="16" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="font-size:16px; line-height:1.4;">
                     <p>Thanks for playing at Neko's!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
          <td style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #555; text-align: left; font-size: 0.8rem; color: #999;">
        <img src="https://play.shopnekos.ca/Nekos-Web-Heading.png" alt="Neko's Header Logo" style="height: 32px; margin-bottom: 0.5rem;" /><br />
        <span style="color: #aaa; text-decoration:none"><a href="https://shopnekos.ca">shopnekos.ca</a> | <a href="mailto:hello@shopnekos.ca">hello@shopnekos.ca</a></span>
      </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
