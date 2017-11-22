/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducers from '../reducers';
import * as auth from '../utils/auth_helper';
import api from '../middleware/api';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export default function configureStore() {
  return new Promise((resolve, reject) => {
    const store = createStore(
      combineReducers(reducers),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      composeEnhancers(applyMiddleware(thunk, api), autoRehydrate())
    );

    persistStore(store, { whitelist: ['user'] }, () => {
      auth.isLoggedIn();
      return resolve(store);
    });
  });
}
