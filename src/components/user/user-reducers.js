import { CREDENTIALS_CHANGED, LOGIN_SUCCESS, LOGIN_FAIL } from '../login/login-types';
import { SET_COOKIE } from './user-types';

const INITIAL_STATE = {
  id: 0,
  username: '',
  password: '',
  loginLoading: false,
  registerLoading: false,
  token: '',
  cookie: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREDENTIALS_CHANGED:
      return {
        ...state,
        [action.payload.id]: action.payload.newValue,
      };
    case LOGIN_SUCCESS:
      return {
        ...state, token: action.payload.data.access_token,
      };
    case SET_COOKIE:
      return {
        ...state, cookie: action.payload,
      }
    default: return state;
  }
};
