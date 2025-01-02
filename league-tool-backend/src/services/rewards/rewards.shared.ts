// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Reward, RewardData, RewardPatch, RewardQuery, RewardService } from './rewards.class'

export type { Reward, RewardData, RewardPatch, RewardQuery }

export type RewardClientService = Pick<RewardService<Params<RewardQuery>>, (typeof rewardMethods)[number]>

export const rewardPath = 'rewards'

export const rewardMethods: Array<keyof RewardService> = ['find', 'get', 'create', 'patch', 'remove']

export const rewardClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(rewardPath, connection.service(rewardPath), {
    methods: rewardMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [rewardPath]: RewardClientService
  }
}
