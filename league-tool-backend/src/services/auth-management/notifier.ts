// services/auth-management/notifier.ts
import type { Application } from '../../declarations'

interface User {
  email: string
  verifyToken?: string
  resetToken?: string
}

interface NotifierOptions {
  [key: string]: any
}

interface Email {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export default (app: Application) => {
  function getLink(type: string, hash?: string): string {
    const domain = app.get('link_domain')

    return `${domain}/auth/${type}?token=${hash}`
  }

  async function sendEmail(email: Email): Promise<any> {
    try {
      const result = await app.service('mailer').create(email)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  return async (type: string, user: User, notifierOptions: NotifierOptions = {}): Promise<any> => {
    if (type === 'resendVerifySignup') {
      const link = getLink('verify', user.verifyToken)
      return sendEmail({
        from: 'no-reply@play.shopnekos.ca',
        to: user.email,
        subject: 'Please confirm your e-mail address',
        text: 'Click here to verify your email: ' + link,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify your email address</title>
</head>
<body style="margin:0; padding:0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width:320px;">
    <tr>
      <td align="center" style="padding:16px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="90%" style="max-width:500px; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
          <tr>
            <td style="padding-left:24px;" align="left">
              <img src="https://play.shopnekos.ca/neko_nobg.png" alt="Neko's Logo" width="48" height="48" style="filter:invert(0) !important; mix-blend-mode:normal !important; display:block; border:none; outline:none;" />
            </td>
          </tr>
          <tr>
            <td style="padding-left:24px; padding-top:16px;" align="left">
              <h1 style="font-weight:bold; color:#2D87E2; mix-blend-mode:normal !important">Verify your email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px;" align="left">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="16" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="font-size:16px; line-height:1.4;">
                    Click the button below to verify your email address:
                  </td>
                </tr>
                <tr><td height="24" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td align="left">
                    <a href="${link}" style="display:inline-block; padding:12px 24px; mix-blend-mode:normal !important; background-color:#2D87E2; color:#ffffff !important; text-decoration:none; border-radius:4px;">Verify Email</a>
                  </td>
                </tr>
                <tr><td height="24" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="font-size:12px; line-height:1.4;">
                    If you didn’t sign up for an account, you can safely ignore this email.
                  </td>
                </tr>
                <tr><td height="32" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="80%" style="border-top:1px solid rgba(255,255,255,0.2);">
                <tr><td height="16" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="left" style="padding:0 24px 24px 24px;">
              <span style="font-size:14px; color:rgba(255,255,255,0.85);">
                <a href="https://shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-right:8px;">shopnekos.ca</a> | 
                <a href="mailto:hello@shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-left:8px;">hello@shopnekos.ca</a>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      })
    }

    if (type === 'verifySignup') {
      return sendEmail({
        from: 'no-reply@play.shopnekos.ca',
        to: user.email,
        subject: 'E-Mail address verified',
        text: 'Registration process complete. Thanks for joining us!',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Registration process complete</title>
</head>
<body style="margin:0; padding:0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width:320px;">
    <tr>
      <td align="center" style="padding:16px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="90%" style="max-width:500px; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
          <tr>
            <td style="padding-left:24px;" align="left">
              <img src="https://play.shopnekos.ca/neko_nobg.png" alt="Neko's Logo" width="48" height="48" style="filter:invert(0) !important; mix-blend-mode:normal !important; display:block; border:none; outline:none;" />
            </td>
          </tr>
          <tr>
            <td style="padding-left:24px; padding-top:16px;" align="left">
              <h1 style="font-weight:bold; color:#43a047;">Your email has been verified</h1>
            </td>
          </tr>
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="80%" style="border-top:1px solid rgba(255,255,255,0.2);">
                <tr><td height="16" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="left" style="padding:0 24px 24px 24px;">
              <span style="font-size:14px; color:rgba(255,255,255,0.85);">
                <a href="https://shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-right:8px;">shopnekos.ca</a> | 
                <a href="mailto:hello@shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-left:8px;">hello@shopnekos.ca</a>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      })
    }

    if (type === 'sendResetPwd') {
      const link = getLink('reset-password', user.resetToken)
      return sendEmail({
        from: 'no-reply@play.shopnekos.ca',
        to: user.email,
        subject: 'Reset your password',
        text: 'Click here to reset your password: ' + link,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset your password</title>
</head>
<body style="margin:0; padding:0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width:320px;">
    <tr>
      <td align="center" style="padding:16px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="90%" style="max-width:500px; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
          <tr>
            <td style="padding-left:24px;" align="left">
              <img src="https://play.shopnekos.ca/neko_nobg.png" alt="Neko's Logo" width="48" height="48" style="filter:invert(0) !important; mix-blend-mode:normal !important; display:block; border:none; outline:none;" />
            </td>
          </tr>
          <tr>
            <td style="padding-left:24px; padding-top:16px;" align="left">
              <h1 style="font-weight:bold; color:#e53935;">Reset your password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px;" align="left">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="16" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="font-size:16px; line-height:1.4;">
                    Click the button below to set a new password:
                  </td>
                </tr>
                <tr><td height="24" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td align="left">
                    <a href="${link}" style="display:inline-block; padding:12px 24px; background-color:#e53935; color:#ffffff !important; text-decoration:none; border-radius:4px;">Reset Password</a>
                  </td>
                </tr>
                <tr><td height="24" style="font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="font-size:12px; line-height:1.4;">
                    If you didn’t ask to reset your password, you can safely ignore this email.
                  </td>
                </tr>
                <tr><td height="32" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="80%" style="border-top:1px solid rgba(255,255,255,0.2);">
                <tr><td height="16" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="left" style="padding:0 24px 24px 24px;">
              <span style="font-size:14px; color:rgba(255,255,255,0.85);">
                <a href="https://shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-right:8px;">shopnekos.ca</a> | 
                <a href="mailto:hello@shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-left:8px;">hello@shopnekos.ca</a>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      })
    }
  }
}
