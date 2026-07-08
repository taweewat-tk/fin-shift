const api = '/api';
const version = '/v1';
const authPrefix = `${api}/auth`;
const basePrefix = `${api}${version}`;

const REQUEST_URL = {
  AUTH: {
    REGISTER: `${authPrefix}/register`,
    LOGIN: `${authPrefix}/login`,
    LOGOUT: `${authPrefix}/logout`,
  },
  ME: {
    GET: `${basePrefix}/me`,
  },
};

export default REQUEST_URL;
