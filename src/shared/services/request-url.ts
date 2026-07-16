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
  CARDS: {
    LIST: `${basePrefix}/cards`,
    CREATE: `${basePrefix}/cards`,
    DETAIL: (id: string) => `${basePrefix}/cards/${id}`,
    UPDATE: (id: string) => `${basePrefix}/cards/${id}`,
    DELETE: (id: string) => `${basePrefix}/cards/${id}`,
  },
};

export default REQUEST_URL;
