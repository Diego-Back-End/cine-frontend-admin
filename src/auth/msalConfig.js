import { PublicClientApplication } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID ?? ''
const tenantId = import.meta.env.VITE_AZURE_AUTHORITY ?? ''

export const isAuthConfigured =
  Boolean(clientId) &&
  Boolean(tenantId) &&
  !clientId.startsWith('REEMPLAZAR') &&
  !tenantId.startsWith('REEMPLAZAR')

const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}/v2.0`,
    knownAuthorities: [`https://login.microsoftonline.com/${tenantId}/v2.0`],
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI ?? window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
}

/**
 * Guía 1.3 - Paso 3: pedir scope delegado hacia msal-api (aud = api://{client-id}).
 * Si VITE_AZURE_SCOPE contiene api://.../access_as_user se usa tal cual;
 * si no, se construye desde VITE_AZURE_CLIENT_ID para evitar error de scope Graph.
 */
const apiScope = import.meta.env.VITE_AZURE_SCOPE?.includes('api://')
  ? import.meta.env.VITE_AZURE_SCOPE
  : clientId
    ? `api://${clientId}/access_as_user`
    : 'api://{client-id}/access_as_user'

export const loginRequest = {
  scopes: ['openid', 'profile', apiScope],
}

export async function initializeMsal() {
  const instance = new PublicClientApplication(msalConfig)
  await instance.initialize()
  return instance
}