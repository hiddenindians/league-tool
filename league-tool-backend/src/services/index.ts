import { mailer } from './mailer/mailer'
import { reward } from './rewards/rewards'
import { game } from './games/games'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { authManagement } from './auth-management/auth-management'

export const services = (app: Application) => {
  app.configure(mailer)
  app.configure(authManagement)
  app.configure(reward)
  app.configure(game)
  app.configure(user)

  // All services will be registered here
}
