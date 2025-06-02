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
  <title>Confirm your email address</title>
</head>
<body style="margin:0; padding:0; background-color:#121212;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#121212" style="min-width:320px;">
    <tr><td align="center" style="padding:1rem 0;">
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
            <span style="font-size:18px; font-weight:bold; color:#ff5722; line-height:1.2;">Confirm your email address</span>
          </td>
        </tr>
        <tr><td style="height:12px; line-height:12px;">&nbsp;</td></tr>
        <tr>
          <td align="center" style="padding:0 1.5rem;">
            <p style="font-size:16px; color:#ffffff; line-height:1.4; margin:0 0 1rem 0;">
              Click the button below to verify your email and complete your registration.
            </p>
            <p style="text-align: center; margin: 2rem 0;">
              <a href="${link}" style="display:inline-block; padding:0.75rem 1.5rem; background-color:#ff5722; color:#ffffff!important; text-decoration:none; border-radius:4px;">Verify Email</a>
            </p>
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
    </td></tr>
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
  <title>You're In!</title>
</head>
<body style="margin:0; padding:0; background-color:#121212;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#121212" style="min-width:320px;">
    <tr><td align="center" style="padding:1rem 0;">
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
            <span style="font-size:18px; font-weight:bold; color:#4caf50; line-height:1.2;">You're In!</span>
          </td>
        </tr>
        <tr><td style="height:12px; line-height:12px;">&nbsp;</td></tr>
        <tr>
          <td align="center" style="padding:0 1.5rem;">
            <p style="font-size:16px; color:#ffffff; line-height:1.4; margin:0 0 0.5rem 0;">
              Your email has been successfully verified. You can now log in and start using your account.
            </p>
            <p style="text-align:center; font-size:0.9rem; color:#777; margin:0;">
              Thank you for joining us!
            </p>
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
    </td></tr>
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
<body style="margin:0; padding:0; background-color:#121212;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#121212" style="min-width:320px;">
    <tr><td align="center" style="padding:1rem 0;">
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
            <span style="font-size:18px; font-weight:bold; color:#d32f2f; line-height:1.2;">Reset your password</span>
          </td>
        </tr>
        <tr><td style="height:12px; line-height:12px;">&nbsp;</td></tr>
        <tr>
          <td align="center" style="padding:0 1.5rem;">
            <p style="font-size:16px; color:#ffffff; line-height:1.4; margin:0 0 1rem 0;">
              Click the button below to set a new password:
            </p>
            <p style="text-align: center; margin: 2rem 0;">
              <a href="${link}" style="display:inline-block; padding:0.75rem 1.5rem; background-color:#d32f2f; color:#ffffff!important; text-decoration:none; border-radius:4px;">Reset Password</a>
            </p>
            <p style="font-size:14px; color:rgba(255,255,255,0.75); line-height:1.4; margin:0;">
              If you didn’t ask to reset your password, you can safely ignore this email.
            </p>
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
    </td></tr>
  </table>
</body>
</html>
`
      })
    }
  }
}
