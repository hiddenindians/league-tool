// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const notifyUserRedemption = async (context: HookContext) => {
  const { data, id, params } = context
  console.log('id ', id)
  console.log('args, ', params)

  if (!data || !data.$push || !data.$push.redemptions) {
    return context
  }
   // Calculate an expiry time 20 minutes from now
  const expiryDateObj = new Date();
  const expiryDateStr = expiryDateObj.toLocaleDateString();
  expiryDateObj.setMinutes(expiryDateObj.getMinutes() + 20);
  const expiryTimeStr = expiryDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const redemptions = data.$push.redemptions.$each
  const user = params.user
  const email = user.email || ''

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
     <p>Hi ${user.username || 'there'},</p>
    <p>Congratulations! You've just redeemed the following ${redemptions.length == 1 ? 'reward': 'rewards'}:</p>
    <ul>
      ${rewardListHtml}
    </ul>
    <p>Steps to claim your ${redemptions.length == 1 ? 'reward': 'rewards'}</p>
    <ol>
      <li>Show this confirmation email at the register</li>
      <li>Claim your rewards!</li>
    </ol>
    <p>This redemption will expire on <strong>${expiryDateStr}</strong> at <strong>${expiryTimeStr}</strong>.</p>
    <p>Thank you for playing at Neko's. We hope you enjoy your ${redemptions.length == 1 ? 'reward': 'rewards'}!</p>
    <p>— Neko's</p>
  `;

  try {
    await context.app.service('mailer').create({
      from: 'no-reply@play.shopnekos.ca',
      to: email,
      subject,
      html
    })
  } catch (err) {
    console.error('Error sending redemption email:', err)
  }
  return context
}
