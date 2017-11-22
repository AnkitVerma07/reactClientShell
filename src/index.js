import "babel-es6-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import configureStore from './store'
import { Provider } from 'react-redux'

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
  // Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'

// Containers
import Full from './containers/Full/'

// View
import Login from './views/Pages/Login';

const history = createBrowserHistory();

function init() {
  configureStore().then((store) => {
    ReactDOM.render((
      <Provider store={store}>
        <HashRouter history={history}>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login}/>
            <Route path="/" name="Home" component={Full}/>
          </Switch>
        </HashRouter>
      </Provider>
    ), document.getElementById('root'));
  });
}

init();
