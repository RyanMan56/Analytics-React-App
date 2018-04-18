import axios from 'axios';
import apiConfig from '../../config/api-config';
import {
  REMOVE_ANALYSER_SUCCESS, REMOVE_ANALYSER_FAIL, GET_ANALYSER_SUCCESS, GET_ANALYSER_FAIL,
  ADD_ANALYSER_SUCCESS, ADD_ANALYSER_FAIL,
} from './manage-project-types';

const { url, routes } = apiConfig;

export const removeAnalyser = (token, projectId, analyserId) => (dispatch) => {
  return axios.delete(`${url}${projectId}/${routes.manageAnalysers}/${analyserId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: REMOVE_ANALYSER_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: REMOVE_ANALYSER_FAIL, payload: e.message });
  });
};

export const getAnalysers = (token, projectId) => (dispatch) => {
  return axios.get(`${url}${projectId}/${routes.manageAnalysers}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: GET_ANALYSER_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: GET_ANALYSER_FAIL, payload: e.message });
  });
};

export const addAnalyser = (token, projectId, username) => (dispatch) => {
  return axios.post(`${url}${projectId}/${routes.manageAnalysers}?username=${username}`, {
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: ADD_ANALYSER_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: ADD_ANALYSER_FAIL, payload: e.message });
  });
};
