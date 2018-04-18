import axios from 'axios';
import apiConfig from '../../config/api-config';
import { CREDENTIALS_CHANGED, LOGIN_SUCCESS, LOGIN_FAIL } from './login-types';

const { url, routes } = apiConfig;

export const login = (username, password) => (dispatch) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');
  return axios.post(url + routes.analyserLogin, params).then((response) => {
    return dispatch({ type: LOGIN_SUCCESS, payload: response });
  }).catch((error) => {
    return dispatch({ type: LOGIN_FAIL, payload: error.message });
  });
};

export const credentialsChanged = (id, newValue) => {
  return ({ type: CREDENTIALS_CHANGED, payload: { id, newValue } });
};
