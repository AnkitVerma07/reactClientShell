/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
import { SHOW_MESSAGE, HIDE_MESSAGE } from '../actions/login_page_actions';

const initialState = {
  title: null,
  message: null,
  isVisible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return { ...state, ...action.error };
    case HIDE_MESSAGE:
      return { ...state, ...action.error };
    default:
      return state;
  }
}
