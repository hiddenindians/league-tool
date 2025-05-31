// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { AuthManagementService } from './auth-management.class'
import { authManagementPath } from './auth-management.shared'
import notifier from './notifier'
import { AuthenticationManagementService } from 'feathers-authentication-management'
export * from './auth-management.class'



// A configure function that registers the service and its hooks via `app.configure`
export const authManagement = (app: Application) => {
  const options = {
 // ...getOptions(app),
  notifier: notifier(app),
  identifyUserProps: ['email'],
  skipPasswordHash: true  
}
  
  // Register our service on the Feathers application
  app.use(authManagementPath, new (AuthenticationManagementService as any)(app, options))

}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [authManagementPath]: AuthManagementService
  }
}
