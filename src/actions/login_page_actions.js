/**
 * @author Donald Green <donald.green@medlmobile.com>
 */

export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export function showMessage(title, message) {
  return {
    type: SHOW_MESSAGE,
    error: {
      isVisible: true,
      title,
      message,
    }
  };
}

export const HIDE_MESSAGE = 'HIDE_MESSAGE';
export function hideMessage() {
  return {
    type: HIDE_MESSAGE,
    error: {
      isVisible: false,
      title: null,
      message: null,
    }
  };
}
