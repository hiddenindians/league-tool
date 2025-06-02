// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
const QRCode = require('qrcode')
export const notifyUserRedemption = async (context: HookContext) => {
  const { data, params } = context

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


  const subject =
    redemptions.length == 1
      ? "You've sucessfully redeemed a reward"
      : "You've sucessfully redeemed some rewards"
  const rewardListHtml = Array.isArray(redemptions)
    ? redemptions.map((r) => `<li>${r.reward} (${r.points_redeemed} points)</li>`).join('')
    : ''

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reward Redemption</title>
</head>
<body style="margin:0; padding:0; background-color:#121212;">
  <table
    cellpadding="0"
    cellspacing="0"
    border="0"
    width="100%"
    bgcolor="#121212"
    style="min-width:320px;"
  >
    <tr>
      <td align="center" style="padding:1rem 0;">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="90%"
          style="
            max-width:500px;
            background-color:#1e1e1e;
            border-radius:8px;
            overflow:hidden;
            font-family:Arial, sans-serif;
            color:#ffffff;
          "
        >
          <tr>
            <td style="height:24px; line-height:24px;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center">
              <img
                src="https://play.shopnekos.ca/neko.png"
                alt="Neko's Logo"
                width="72"
                height="72"
                style="
                  display:block;
                  border:none;
                  outline:none;
                  background-color:#ffffff;
                  border-radius:50%;
                  padding:8px;
                "
              />
            </td>
          </tr>
          <tr>
            <td style="height:16px; line-height:16px;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center" style="padding:0 1.5rem;">
              <span style="font-size:18px; font-weight:bold; color:#00c6a6; line-height:1.2;">
                Congratulations${' &nbsp;' + user.username || ''}! You&rsquo;ve just redeemed the following ${redemptions.length === 1 ? 'reward' : 'rewards'}:
              </span>
            </td>
          </tr>
          <tr>
            <td style="height:12px; line-height:12px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:0 1.5rem;">
              <ul style="margin:0 0 1rem 1.2rem; padding:0; font-size:16px; color:#ffffff; line-height:1.4;">
                ${rewardListHtml}
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:0 1.5rem;">
              <p style="margin:0 0 0.5rem 0; font-size:16px; color:#ffffff; line-height:1.4;">
                Steps to claim your ${redemptions.length === 1 ? 'reward' : 'rewards'}:
              </p>
              <ol style="margin:0 0 1rem 1.5rem; padding:0; font-size:16px; color:#ffffff; line-height:1.4;">
                <li>Show this confirmation email at the register</li>
                <li>Claim your rewards!</li>
              </ol>
            </td>
          </tr>
          <tr>
            <td style="padding:0 1.5rem; text-align:center;">
              ${
                qrDataUrl
                  ? `<img src="${qrDataUrl}" alt="Scan QR code" style="max-width:300px; margin-bottom:1rem;" />`
                  : `<p style="color:#ff6f61;">(QR code generation failed; please <a href="${verifyUrl}" style="color:#00c6a6;">click here</a> to verify.)</p>`
              }
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 1.5rem; font-size:16px; color:#ffffff; line-height:1.4;">
              <strong style="word-break: break-word; display:inline-block; text-align:center;">
                ${data.generatedCode.slice(0, data.generatedCode.length / 2)}<br/>
                ${data.generatedCode.slice(data.generatedCode.length / 2)}
              </strong><br/>
              <small style="font-size:12px; color:#999;">
                [If this shows 'undefined', something went wrong. Please let us know via <a href="https://discord.gg/7eGUwGMAuA" style="color:#00c6a6;">Discord</a>.]
              </small>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:1rem 1.5rem 0 1.5rem; font-size:16px; color:#ffffff; line-height:1.4;">
              This redemption will expire on <strong>${expiryDateStr}</strong> at <strong>${expiryTimeStr}</strong>.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 1.5rem 1rem 1.5rem; font-size:16px; color:#ffffff; line-height:1.4;">
              Thank you for playing at Neko&rsquo;s. We hope you enjoy your ${redemptions.length === 1 ? 'reward' : 'rewards'}!
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 1.5rem 1rem 1.5rem; font-size:16px; color:#ffffff; line-height:1.4;">
              &mdash; Neko&rsquo;s
            </td>
          </tr>
          <tr>
            <td style="height:20px; line-height:20px;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="80%" style="border-top:1px solid rgba(255,255,255,0.2);">
                <tr><td style="font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height:20px; line-height:20px;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center">
              <img
                src="https://play.shopnekos.ca/Nekos-Web-Heading.png"
                alt="Neko's Header Logo"
                width="160"
                style="display:block; border:none; outline:none;"
              />
            </td>
          </tr>
          <tr>
            <td style="height:8px; line-height:8px;">&nbsp;</td>
          </tr>
          <tr>
            <td align="left" style="padding:0 1.5rem;">
              <span style="font-size:14px; color:rgba(255,255,255,0.85);">
                <a href="https://shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-right:8px;">shopnekos.ca</a> |
                <a href="mailto:hello@shopnekos.ca" style="color:#3498db!important; text-decoration:none; margin-left:8px;">hello@shopnekos.ca</a>
              </span>
            </td>
          </tr>
          <tr>
            <td style="height:24px; line-height:24px;">&nbsp;</td>
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
