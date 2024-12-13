import { login, getCredentials } from "../services/auth.js" 
import client from "../services/client.js"

const addEventListener = (selector, event, handler) => {
    document.addEventListener(event, async (ev) => {
        if (ev.target.closest(selector)) {
            handler(ev)
        }
    })
}

export const signUpListener = () => {
    addEventListener('#signup', 'click', async() => {
        const credentials = getCredentials();
        console.log(credentials)
        await client.service('users').create(credentials);
        await login(credentials);
    })
}

export const loginListener = () => {
    addEventListener('#login', 'click', async () => {
        const user = getCredentials();
        await login(user);
    })
}
