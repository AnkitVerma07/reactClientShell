
import { host } from '../config/api_config';
import * as auth from './auth_helper';

// request handler
export default async function request(config) {
  // variables
  // const endpoint = host + config.endpoint;
  const endpoint = (config.endpoint.indexOf(host) === -1) ? host + config.endpoint : config.endpoint;
  const options = { method: config.method, headers: {} };

  // auth
  if (config.auth) {
    try {
      const token = await auth.getToken();
      options.headers.Authorization = `Bearer ${token.access_token}`;
    } catch (error) {
      console.log('could not complete request: ', error);
      throw error;
    }
  }

  // body
  if (config.body) {
    options.headers['Content-Type'] = config.contentType || 'application/json';
    options.body = config.body instanceof Object ? JSON.stringify(config.body) : config.body;
  }

  options.headers.Accept = 'application/json';
  options.credentials = 'include';

  return fetch(endpoint, options);
}

// helper Functions
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkResponse(response) {
  return response.json().then((body) => {
    if (body.success) return body.result;
    else if (body.error) {
      if(body.message.message){
        throw new Error(body.message.message);
      } else {
        throw new Error(body.message);
      }
    }
    else throw new Error('Unknown response type');
  });
}
