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

   return async (
    type: string,
    user: User,
    notifierOptions: NotifierOptions = {}
  ): Promise<any> => {
    if (type === 'resendVerifySignup') {
      const link = getLink('verify', user.verifyToken)
      return sendEmail({
        from: 'no-reply@play.shopnekos.ca',
        to: user.email,
        subject: 'Please confirm your e-mail address',
        text: 'Click here to verify your email: ' + link,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Confirm your email address</h2>
            <p>Click the button below to verify your email and complete your registration.</p>
            <p><a href="${link}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a></p>
            <p>If you didn't sign up, please ignore this message.</p>
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
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Welcome aboard!</h2>
            <p>Your email has been successfully verified.</p>
            <p>You can now log in and start using your account.</p>
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
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Reset your password</h2>
            <p>We received a request to reset your password. Click the button below to continue:</p>
            <p><a href="${link}" style="display:inline-block;padding:10px 20px;background:#dc3545;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a></p>
            <p>If you did not request this, you can safely ignore this message.</p>
          </div>
        `
      })
    }
  }
}
