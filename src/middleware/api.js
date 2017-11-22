
import { normalize, schema } from 'normalizr'
import { host } from '../config/api_config';
import request from '../utils/request_helper';

// Extracts the next page URL from Github API response.
const getNextPageUrl = (response, json) => {
  const resultLength = json.result.length;
  if (!resultLength) {
    return null;
  }

  const urlParts = response.url.split('?');
  const urlParamsPart = urlParts[1];

  if (!urlParamsPart) {
    // assume we already got page 1
    return urlParts[0] + '?page=2';
  }

  const urlParams = urlParamsPart.split('&');
  const urlParamsMap = {};
  urlParams.forEach((urlParamSet) => {
    const paramSet = urlParamSet.split('=');
    urlParamsMap[paramSet[0]] = paramSet[1];
  });

  // If page is not found default to page 2, otherwise increment page
  urlParamsMap.page = urlParamsMap.page ? parseInt(urlParamsMap.page, 10) + 1 : 2;

  const paramsToAttach = Object.keys(urlParamsMap).map((key) => {
    return [`${key}=${urlParamsMap[key]}`];
  }).join('&');

  return urlParts[0] + `?${paramsToAttach}`;

  // const link = response.headers.get('link');
  // if (!link) {
  //   return null;
  // }
  //
  // const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1);
  // if (!nextLink) {
  //   return null;
  // }
  //
  // return nextLink.split(';')[0].slice(1, -1)
};

// const API_ROOT = 'https://api.github.com/';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (reqInfo, schema) => {
  // const fullUrl = (endpoint.indexOf(host) === -1) ? host + endpoint : endpoint;

  return request(reqInfo)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }

        const nextPageUrl = getNextPageUrl(response, json);

        return Object.assign({},
          normalize(json.result, schema),
          { nextPageUrl },
        );
      })
    );
};

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr

// GitHub's API may return results with uppercase letters while the query
// doesn't contain any. For example, "someuser" could result in "SomeUser"
// leading to a frozen UI as it wouldn't find "someuser" in the entities.
// That's why we're forcing lower cases down there.

const userSchema = new schema.Entity('users', {}, {
  idAttribute: user => user.id
});

// Schemas for Github API responses.
export const Schemas = {
  USER: userSchema,
  USER_ARRAY: [userSchema]
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { reqInfo } = callAPI;
  const { schema, types } = callAPI;

  if (typeof reqInfo.endpoint === 'function') {
    reqInfo.endpoint = reqInfo.endpoint(store.getState());
  }

  if (typeof reqInfo.endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [ requestType, successType, failureType ] = types;
  next(actionWith({ type: requestType }));

  return callApi(reqInfo, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
