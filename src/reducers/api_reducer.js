/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import * as ActionTypes from '../actions';
import merge from 'lodash/merge';
import paginate from './paginate';
import { combineReducers } from 'redux';

// Updates an entity cache in response to any action with response.entities.
export const entities = (state = { users: {}}, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }
  return state;
};

// Updates error message to notify about the failed fetches.
export const errorMessage = (state = null, action) => {
  const { type, error } = action;

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return error;
  }

  return state;
};

// Updates the pagination data for different actions.
export const pagination = combineReducers({
  users: paginate({
    mapActionToKey: action => action.page,
    types: [
      ActionTypes.USERS_REQUEST,
      ActionTypes.USERS_SUCCESS,
      ActionTypes.USERS_FAILURE
    ]
  }),
});
