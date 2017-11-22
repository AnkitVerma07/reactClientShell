/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import { host, client } from '../config/api_config';
// TODO: this module should export a react component to avoid importing the store as a singleton
// all login/logout actions should go through redux
import store from '../store';
import { LOGOUT } from '../actions';

// Error constants
export const NOT_LOGGED_IN = 'User is not logged in';
export const INVALID_TOKEN = 'Invalid token';
export const TOKEN_REFRESH_FAILED = 'Failed to refresh token';
export const INVALID_CREDENTIALS =
  'Username or password was incorrect. Please try again.';

// private variables
let token = null;
let tokenRequest = null;

// public functions
export function login(user) {
  return requestToken(user);
}

export function logout() {
  token = null;
  tokenRequest = null;
  localStorage.removeItem('auth_token');
  localStorage.clear();
  // store.dispatch({ type: LOGOUT });
  return false;
}

export async function getToken() {
  // If token is not in memory, check async storage
  if (!token) {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      token = JSON.parse(savedToken);
    } else {
      logout();
      throw new Error(NOT_LOGGED_IN);
    }
  }

  // Check if token object contains an access token
  if (!token.access_token) {
    logout();
    throw new Error(INVALID_TOKEN);
  }

  // Check if token is expired
  if (token.expires_on && token.expires_on < Date.now()) {
    await refreshToken(token).catch(() => {
      logout();
      throw new Error(TOKEN_REFRESH_FAILED);
    });
  }

  // If we've reached this point the we can assume we have a valid token
  return token;
}

export async function isLoggedIn() {
  try {
    await getToken();
    return !!token;
  } catch (error) {
    if (error.message === NOT_LOGGED_IN) {
      return false;
    }
  }
  return false;
}

// oauth requests
export function requestToken(user) {
  // Check to see if there is a pending token request
  if (tokenRequest) return tokenRequest;
  // Otherwise make new request
  const endpoint = '/oauth/token';
  const clientToken = btoa(`${client.id}:${client.secret}`);

  const request = fetch(host + endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Basic ${clientToken}`,
    },
    body: JSON.stringify({
      grant_type: 'password',
      username: user.username,
      password: user.password,
      role_type: 'ROLE_WEB',
      scope: 'read',
    }),
    credentials: 'include',
  })
    .then(checkStatus)
    .then(saveTokenFromResponse);

  tokenRequest = request;
  return request;
}

export async function refreshToken(expiredToken) {
  // Check to see if there is a pending token request
  if (tokenRequest) return tokenRequest;
  // Otherwise make new request
  const endpoint = '/oauth/token';
  const clientToken = btoa(`${client.id}:${client.secret}`);

  const request = fetch(host + endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Basic ${clientToken}`,
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: expiredToken.refresh_token,
      scope: 'read',
    }),
    credentials: 'include',
  })
    .then(checkStatus)
    .then(saveTokenFromResponse);

  tokenRequest = request;
  return request;
}

// Request helper functions
function checkStatus(response) {
  let error;
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 403) {
    error = new Error(INVALID_CREDENTIALS);
  } else {
    error = new Error(response.statusText);
  }

  logout();
  error.response = response;
  throw error;
}

async function saveTokenFromResponse(response) {
  const newToken = await response.json();

  // Don't save the token if it doesn't have an access_token
  if (!newToken.access_token) {
    throw new Error(INVALID_TOKEN);
  }

  // save token
  newToken.expires_on = Date.now() + newToken.expires_in * 1000;
  token = newToken;
  localStorage.setItem('auth_token', JSON.stringify(newToken));
  tokenRequest = null;
  return newToken;
}
