// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
const QRCode = require('qrcode')
export const notifyUserRedemption = async (context: HookContext) => {
  const { data, params } = context
  console.log('result ', context.data.generatedCode)

  if (!data || !data.$push || !data.$push.redemptions) {
    return context
  }

  if (!data.generatedCode) {
    return context
  }
  // Calculate an expiry time 20 minutes from now
  const expiryDateObj = new Date()
  const expiryDateStr = expiryDateObj.toLocaleDateString()
  expiryDateObj.setMinutes(expiryDateObj.getMinutes() + 20)
  const expiryTimeStr = expiryDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const redemptions = data.$push.redemptions.$each
  const user = params.user
  const email = user.email || ''
  const linkDomain = context.app.get('link_domain')
  const verifyUrl = `${linkDomain}/verify/${data.generatedCode}`
  let qrDataUrl: string
  let qrBuffer: Buffer | null = null

  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 })
    // Convert data URL to a Buffer for embedding as an attachment
    const base64Data = qrDataUrl.split(',')[1] || ''
    qrBuffer = Buffer.from(base64Data, 'base64')
  } catch (err) {
    console.error('Failed to generate QR code:', err)
    qrDataUrl = ''
  }
  if (email == '') {
    return context
  }

  console.log(qrDataUrl)

  const subject =
    redemptions.length == 1
      ? "You've sucessfully redeemed a reward"
      : "You've sucessfully redeemed some rewards"
  const rewardListHtml = Array.isArray(redemptions)
    ? redemptions.map((r) => `<li>${r.reward} (${r.points_redeemed} points)</li>`).join('')
    : ''

  const html = `
     <p>Hi ${user.username || 'there'},</p>
    <p>Congratulations! You've just redeemed the following ${redemptions.length == 1 ? 'reward' : 'rewards'}:</p>
    <ul>
      ${rewardListHtml}
    </ul>
    <p>Steps to claim your ${redemptions.length == 1 ? 'reward' : 'rewards'}</p>
    <ol>
      <li>Show this confirmation email at the register</li>
      <li>Claim your rewards!</li>
    </ol>
    <hr/>
    <p> For Staff Use </p>
    <figure>
    ${
      qrBuffer
        ? `<img src="cid:qrCode" alt="We will scan this to verify your code" style="max-width:300px;" />`
        : `<p>(QR code generation failed; if you're an employee at Neko's click <a href="${verifyUrl}">here</a> to verify.)</p>`
    }

   <figcaption>Validation Code</figcaption></figure>
   <p> <strong>
    ${data.generatedCode.slice(0, data.generatedCode.length / 2)}<br/>
    ${data.generatedCode.slice(data.generatedCode.length / 2)}
  </strong><br/>[If this says 'undefined', something went wrong. Please let @hiddenindians know <a href="https://discord.gg/7eGUwGMAuA">via our discord</a></p>
    <p>This redemption will expire on <strong>${expiryDateStr}</strong> at <strong>${expiryTimeStr}</strong>.</p>
    <p>Thank you for playing at Neko's. We hope you enjoy your ${redemptions.length == 1 ? 'reward' : 'rewards'}!</p>
    <p>— Neko's</p>
  `

  try {
    const message: any = {
      from: 'no-reply@play.shopnekos.ca',
      to: email,
      subject,
      html
    }
    // If QR was successfully generated, attach it with a Content-ID
    if (qrBuffer) {
      message.attachments = [
        {
          filename: 'qr.png',
          content: qrBuffer,
          cid: 'qrCode'
        }
      ]
    }
    await context.app.service('mailer').create(message)
  } catch (err) {
    console.error('Error sending redemption email:', err)
  }

  context.result.user = params.user
  
  context.result.generatedCode = context.data.generatedCode
  return context
}
