// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { rewardClient } from './services/rewards/rewards.shared'
export type { Reward, RewardData, RewardQuery, RewardPatch } from './services/rewards/rewards.shared'

import { validatePasswordClient } from './services/validate-password/validate-password.shared'
export type {
  ValidatePassword,
  ValidatePasswordData,
  ValidatePasswordQuery,
  ValidatePasswordPatch
} from './services/validate-password/validate-password.shared'

import { gameClient } from './services/games/games.shared'
export type { Game, GameData, GameQuery, GamePatch } from './services/games/games.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the league-tool-backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(gameClient)
  client.configure(validatePasswordClient)
  client.configure(rewardClient)
  return client
}
