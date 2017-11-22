/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import * as api from '../utils/api_helper';
import * as auth from '../utils/auth_helper';
import { showMessage, hideMessage } from './login_page_actions';

const loginPauseTimeMS = 1000;
export const LOGIN = 'LOGIN';
export function login(email, password) {
  return (dispatch) => {
    dispatch(isLoggingIn(true));
    const then = Date.now();
    return api
      .authenticateAdmin(email, password)
      .then(() => {
        const now = Date.now();
        const reqDuration = now - then;
        const pauseTimeLeft = loginPauseTimeMS - reqDuration >= 0 ? loginPauseTimeMS - reqDuration : 0;

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch({ type: LOGIN });
            dispatch(getUserLoggedIn());
            return resolve(true);
          }, pauseTimeLeft);
        });
      })
      .catch((error) => {
        dispatch(showMessage('Login', error.message));
        dispatch(isLoggingIn(false));
        // console.error('error: ', error);
      })
  };
}

export const LOGOUT = 'LOGOUT';
export function logout() {
  return (dispatch) => {
    auth.logout();
    dispatch({
      type: LOGOUT,
    })
  }
}

export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export function getUserLoggedIn() {
  return dispatch =>
    api
      .getUserLoggedIn()
      .then((response) => response.json())
      .then((user) => {
        dispatch({
          type: GET_USER_PROFILE,
          payload: user,
        });
      });
}

export const IS_LOGGED_IN = "IS_LOGGED_IN";
export function isLoggedIn() {
  return (dispatch) => {
    return auth
      .isLoggedIn()
      .then((loggedIn) => {
        const message = {
          type: loggedIn ? IS_LOGGED_IN : LOGOUT,
          isLoggedIn: loggedIn ? loggedIn : false,
        };

        dispatch(message);
      })
      .catch((err) => {
        dispatch({
          type: LOGOUT,
        });
      });
  }
}

export const IS_LOGGING_IN = 'IS_LOGGING_IN';
export function isLoggingIn(loggingIn) {
  return {
    type: IS_LOGGING_IN,
    payload: {
      isLoggingIn: loggingIn,
    },
  };
}
