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
  <div style="font-family: sans-serif; background-color: #f8f8f8; padding: 2rem;">
    <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 2rem;">
      <img src="https://play.shopnekos.ca/neko.png" alt="Neko's Logo" style="height: 48px; display: block; margin: 0 auto 1rem;" />
      <h2 style="text-align: center; color: #ff5722;">Confirm your email address</h2>
      <p>Click the button below to verify your email and complete your registration.</p>
      <p style="text-align: center; margin: 2rem 0;">
        <a href="${link}" style="padding: 0.75rem 1.5rem; background-color: #ff5722; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
      </p>
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #555; text-align: left; font-size: 0.8rem; color: #999;">
  <img src="https://play.shopnekos.ca/Nekos-Web-Heading.png" alt="Neko's Header Logo" style="height: 32px; margin-bottom: 0.5rem;" /><br />
        <span style="color: #aaa; text-decoration:none"><a href="https://shopnekos.ca">shopnekos.ca</a> | <a href="mailto:hello@shopnekos.ca">hello@shopnekos.ca</a></span>
</div>
    </div>
  </div>
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
  <div style="font-family: sans-serif; background-color: #f8f8f8; padding: 2rem;">
    <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 2rem;">
      <img src="https://play.shopnekos.ca/neko.png" alt="Neko's Logo" style="height: 48px; display: block; margin: 0 auto 1rem;" />
      <h2 style="text-align: center; color: #4caf50;">You're In!</h2>
      <p>Your email has been successfully verified. You can now log in and start using your account.</p>
      <p style="text-align: center; font-size: 0.9rem; color: #777;">Thank you for joining us!</p>
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #555; text-align: left; font-size: 0.8rem; color: #999;">
  <img src="https://play.shopnekos.ca/Nekos-Web-Heading.png" alt="Neko's Header Logo" style="height: 32px; margin-bottom: 0.5rem;" /><br />
        <span style="color: #aaa; text-decoration:none"><a href="https://shopnekos.ca">shopnekos.ca</a> | <a href="mailto:hello@shopnekos.ca">hello@shopnekos.ca</a></span>
</div>
    </div>
  </div>
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
  <div style="font-family: sans-serif; background-color: #f8f8f8; padding: 2rem;">
    <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 2rem;">
      <img src="https://play.shopnekos.ca/neko.png" alt="Neko's Logo" style="height: 48px; display: block; margin: 0 auto 1rem;" />
      <h2 style="text-align: center; color: #d32f2f;">Reset your password</h2>
      <p>Click the button below to set a new password:</p>
      <p style="text-align: center; margin: 2rem 0;">
        <a href="${link}" style="padding: 0.75rem 1.5rem; background-color: #d32f2f; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
      </p>
      <p style="font-size: 0.9rem; color: #777;">If you didn’t ask to reset your password, you can safely ignore this email.</p>
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #555; text-align: left; font-size: 0.8rem; color: #999;">
  <img src="https://play.shopnekos.ca/Nekos-Web-Heading.png" alt="Neko's Header Logo" style="height: 32px; margin-bottom: 0.5rem;" /><br />
        <span style="color: #aaa; text-decoration:none"><a href="https://shopnekos.ca">shopnekos.ca</a> | <a href="mailto:hello@shopnekos.ca">hello@shopnekos.ca</a></span>


</div>
    </div>
  </div>
`
      })
    }
  }
}
