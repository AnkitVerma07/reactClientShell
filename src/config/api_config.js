/**
 * @author Donald Green <donald.green@medlmobile.com>
 */
const ENV = {
  develop:{
    baseURL: '',
  },
  stage:{
    baseURL: '',
  },
  local: {
    baseURL: 'http://localhost:3000',
  },
  production:{
    baseURL: '',
  }
};

export const host = ENV.local.baseURL;

export const client = {
  id: "",
  secret: "",
};
