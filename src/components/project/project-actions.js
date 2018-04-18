import axios from 'axios';
import apiConfig from '../../config/api-config';
import {
  GET_EVENTS_SUCCESS, GET_EVENTS_FAIL, GET_PROPERTIES_SUCCESS, GET_PROPERTIES_FAIL,
  OPEN_MODAL, CLOSE_MODAL, SET_ACTIVE_EVENT, GET_USERS_SUCCESS, GET_USERS_FAIL,
} from './project-types';

const { url, routes } = apiConfig;

export const getEvents = (token, id) => (dispatch) => {
  return axios.get(`${url}${id}/${routes.getEvents}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: GET_EVENTS_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: GET_EVENTS_FAIL, payload: e.message });
  });
};

export const getEventProperties = (token, projectId, eventId) => (dispatch) => {
  return axios.get(`${url}${projectId}/${routes.getEvents}/${eventId}/${routes.getProperties}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: GET_PROPERTIES_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: GET_PROPERTIES_FAIL, payload: e.message });
  });
};

export const getUsers = (token, projectId) => (dispatch) => {
  return axios.get(`${url}${projectId}/${routes.getProjectUsers}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: GET_USERS_FAIL, payload: e.message });
  });
}

export const closeModal = () => {
  return { type: CLOSE_MODAL };
};

export const openModal = () => {
  return { type: OPEN_MODAL };
};

export const setActiveEvent = (eventId) => {
  return { type: SET_ACTIVE_EVENT, payload: eventId };
}
