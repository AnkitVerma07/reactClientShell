
import { LOGIN, LOGOUT, GET_USER_PROFILE, IS_LOGGED_IN, IS_LOGGING_IN } from '../actions/user_actions';

const initialState = {
  isLoggedIn: false,
  isLoggingIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isLoggedIn: true, isLoggingIn: false, };
    case LOGOUT:
      return { isLoggedIn: false };
    case GET_USER_PROFILE:
      return { ...state, ...action.payload };
    case IS_LOGGED_IN:
      return { ...state, ...action.isLoggedIn };
    case IS_LOGGING_IN:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
