import { loginTemplate } from '../templates/login.js'
import { dashboardTemplate } from '../templates/dashboard.js';
import { loginListener, signUpListener } from './eventHandlers.js';
loginListener();signUpListener();

export const showLogin = () => {
    document.getElementById('app').innerHTML = loginTemplate();
}

export const showDasboard = () => {
    document.getElementById('app').innerHTML = dashboardTemplate();
}

