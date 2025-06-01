// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations';

export const clearOauthCookies = async (context: HookContext) => {
  // In an Express-based Feathers REST call, the raw response object is in context.params.res:
  const res = (context.params as any).res;
  if (res && typeof res.clearCookie === 'function') {

    // Expire the OAuth-state cookies if they exist
    res.clearCookie('feathers-oauth', { path: '/' });
    res.clearCookie('feathers-oauth.sig', { path: '/' });

  } else {
    console.log('[clearOauthCookies] No Express res or clearCookie method found; skipping cookie clear');
  }

  return context;
};
