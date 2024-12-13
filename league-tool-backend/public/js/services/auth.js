import client from '../services/client.js'
import { showLogin, showDasboard } from '../utils/shows.js'
export const login = async (credentials) => {
    try{
        if(!credentials) {
            await client.reAuthenticate()
        } else {
            await client.authenticate({
                strategy: 'local',
                ...credentials
            })
        }

        showDasboard()
    } catch (error) {
        showLogin(error)
    }
}

export const getCredentials = () => {
    const user = {
        email: document.querySelector('[name="email"]').value,
        password: document.querySelector('[name="password"]').value
    }
    return user;
}