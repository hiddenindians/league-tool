// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationRequest, AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import axios, { AxiosRequestConfig } from 'axios'

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
  async getProfile(authResult: AuthenticationRequest) {
    if (authResult.code) {
      const tokenData = await this.getTokenResponse(authResult.code)
      authResult.accessToken = tokenData.access_token
    }
    const accessToken = authResult.accessToken
    const userOptions: AxiosRequestConfig = {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      url: 'https://discord.com/api/v10/users/@me'
    }
    const { data } = await axios(userOptions)
    return data
  }

  async getEntityQuery(profile: OAuthProfile, _params: Params): Promise<{ [x: string]: any }> {
    return {
      $or: [{ email: profile.email }, { discordId: profile.id }]
    }
  }

  async getEntityData(profile: OAuthProfile, _existingEntity: any, _params: Params) {
    // `profile` is the data returned by getProfile

    if (profile.avatar == null) {
      profile.avatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
    } else {
      const isGif = profile.avatar.startsWith('a_')
      profile.avatar = `https://cdn.discordapp.com/avatars/${profile['id']}/${profile['avatar']}.${isGif ? 'gif' : 'png'}`
    }
    console.log(_existingEntity)
    
    return {
      discordId: profile.id,
      username: profile.username,
      email: profile.email,
      avatar: profile.avatar,
      role: _existingEntity.role  || 'player'
      // games: [],
      //redemptions: [],
      //total_points: 0,
      //total_redeemed: 0,
      //first_run: true
    }
  }

  async getTokenResponse(data: AuthenticationRequest) {
    const tokenOptions: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: 'https://discord.com/api/oauth2/token',
      data: new URLSearchParams({
        client_id: this.configuration.key,
        client_secret: this.configuration.secret,
        grant_type: 'authorization_code',
        code: data.toString(),
        redirect_uri: this.configuration.redirect_uri,
        scope: 'identify email'
      }).toString()
    }

    try {
      const { data: response } = await axios(tokenOptions)
      return response
    } catch (error) {
      // Log more details about the error
      if (axios.isAxiosError(error) && error.response) {
        console.error('Discord API Error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        })
      }
      throw error
    }
  }
}
