import axios from 'axios';
import apiConfig from '../../config/api-config';
import {
  GET_PROJECTS_SUCCESS, GET_PROJECTS_FAIL, OPEN_MODAL, CLOSE_MODAL,
  CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAIL, SET_ACTIVE_PROJECT,
} from './dashboard-types';

const { url, routes } = apiConfig;

export const getProjects = token => (dispatch) => {
  return axios.get(url + routes.getProjects, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: GET_PROJECTS_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: GET_PROJECTS_FAIL, payload: e.message });
  });
};

export const createProject = (name, password, token) => (dispatch) => {
  return axios.post(url + routes.createProject, {
    name,
    password,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: CREATE_PROJECT_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: CREATE_PROJECT_FAIL, payload: e.message });
  });
};

export const closeModal = () => {
  return { type: CLOSE_MODAL };
};

export const openModal = () => {
  return { type: OPEN_MODAL };
};

export const setActiveProject = (id) => {
  return { type: SET_ACTIVE_PROJECT, payload: id };
};
