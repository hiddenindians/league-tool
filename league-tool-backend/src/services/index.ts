import { game } from './games/games'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(game)
  app.configure(user)
  // All services will be registered here
}
