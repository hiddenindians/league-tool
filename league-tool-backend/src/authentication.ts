// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationRequest, AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import axios, {AxiosRequestConfig} from 'axios'

import type { Application } from './declarations'
import { oauth, OAuthProfile, OAuthStrategy } from '@feathersjs/authentication-oauth'
import { Params } from '@feathersjs/feathers'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('discord', new DiscordStrategy())
  
  app.use('authentication', authentication)
  app.configure(oauth())
}

export class DiscordStrategy extends OAuthStrategy {
  async getProfile(authResult: AuthenticationRequest){
    const accessToken = authResult.access_token;
    const userOptions: AxiosRequestConfig = {
      method: 'GET',
      headers: {'Authorization': `Bearer ${accessToken}`},
      url: `https://discord.com/api/users/@me`
    }
    const { data } = await axios(userOptions)
    return data;
  }
  async getEntityData(profile: OAuthProfile, _existingEntity: any, _params: Params) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile, _existingEntity, _params);

    if (profile.avatar == null) {
      profile.avatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
    } else {
      const isGif = profile.avatar.startsWith('a_');
      profile.avatar = `https://cdn.discordapp.com/avatars/${profile['id']}/${profile['avatar']}.${isGif ? 'gif' : 'png'}`
    }

    return {
      ...baseData,
      username: profile.username,
      email: profile.email,
      avatar: profile.avatar,
    };
  }
    
  
}
