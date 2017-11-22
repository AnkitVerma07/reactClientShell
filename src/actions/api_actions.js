/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import { CALL_API, Schemas } from '../middleware/api';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

const signupI = (data) => ({
  [CALL_API]: {
    types: [SIGN_UP_REQUEST, SIGN_UP_SUCCESS,SIGN_UP_FAILURE],
    reqInfo: {
      endpoint: '/api/users/',
      method: 'POST',
      body: data
    },
    schema: Schemas.USER,
  },
});


export const signup = (data) => (dispatch) => {
  return dispatch(signupI(data));
};


export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUser = login => ({
  [CALL_API]: {
    types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
    endpoint: `/users/${login}`,
    schema: Schemas.USER
  }
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadUser = (login, requiredFields = []) => (dispatch, getState) => {
  const user = getState().entities.users[login];
  if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
    return null;
  }

  return dispatch(fetchUser(login));
};
