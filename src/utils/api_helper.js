/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import request from './request_helper';
import * as auth from './auth_helper';


export const authenticateAdmin = (username, pass) => {
  // UPDATED
  const userBody = {
    grant_type: 'password',
    scope: 'read',
    username: username,
    password: pass,
  };

  return auth.login(userBody);
};

export const getUserLoggedIn = () => {
  // UPDATED
  return request({
    endpoint: '/api/users/find/me',
    method: 'GET',
    auth: true,
  });
};
