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
 

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Points Added</title>
</head>
<body style="margin:0; padding:0; background-color:#121212;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#121212" style="min-width:320px;">
    <tr>
      <td align="center" style="padding:1rem 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="90%" style="max-width:500px; background-color:#1e1e1e; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
          <tr><td style="height:24px; line-height:24px;">&nbsp;</td></tr>
          <tr>
            <td align="center">
              <img src="https://play.shopnekos.ca/neko.png" alt="Neko's Logo" width="72" height="72" style="display:block; border:none; outline:none; background-color:#ffffff; border-radius:50%; padding:8px;" />
            </td>
          </tr>
          <tr><td style="height:16px; line-height:16px;">&nbsp;</td></tr>
          <tr>
            <td align="center">
              <span style="font-size:18px; font-weight:bold; color:#00c6a6; line-height:1.2;">
                Congratulations${' &nbsp;' + user.username || ''}!
              </span>
            </td>
          </tr>
          <tr><td style="height:12px; line-height:12px;">&nbsp;</td></tr>
          <tr>
            <td align="center" style="padding:0 1.5rem;">
              <span style="font-size:16px; color:#ffffff; line-height:1.4;">
                ${bonusCode.points_awarded} points have been added to your account.
              </span>
            </td>
          </tr>
          <tr><td style="height:12px; line-height:12px;">&nbsp;</td></tr>
          <tr>
            <td align="center" style="padding:0 1.5rem;">
              <span style="font-size:16px; color:#ffffff; line-height:1.4;">
                Thank you for playing at Neko's. We hope you had a great time!
              </span>
            </td>
          </tr>
          <tr><td style="height:12px; line-height:12px;">&nbsp;</td></tr>
          <tr>
            <td align="center" style="padding:0 1.5rem;">
              <span style="font-size:16px; color:#ffffff; line-height:1.4;">
                &mdash; Neko's
              </span>
            </td>
          </tr>
          <tr><td style="height:20px; line-height:20px;">&nbsp;</td></tr>
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="80%" style="border-top:1px solid rgba(255,255,255,0.2);">
                <tr><td style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:20px; line-height:20px;">&nbsp;</td></tr>
          <tr>
            <td align="center">
              <img src="https://play.shopnekos.ca/Nekos-Web-Heading.png" alt="Neko's Header Logo" width="160" style="display:block; border:none; outline:none;" />
            </td>
          </tr>
          <tr><td style="height:8px; line-height:8px;">&nbsp;</td></tr>
          <tr>
            <td align="left" style="padding:0 1.5rem;">
              <span style="font-size:14px; color:rgba(255,255,255,0.85);">
                <a href="https://shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-right:8px;">shopnekos.ca</a> |
                <a href="mailto:hello@shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-left:8px;">hello@shopnekos.ca</a>
              </span>
            </td>
          </tr>
          <tr><td style="height:24px; line-height:24px;">&nbsp;</td></tr>
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
