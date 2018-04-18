import { SET_COOKIE, LOGOUT } from './user-types';

export const setCookie = response => ({ type: SET_COOKIE, payload: response });

export const logout = response => ({ type: LOGOUT });
