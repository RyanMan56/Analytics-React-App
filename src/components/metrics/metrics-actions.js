import axios from 'axios';
import apiConfig from '../../config/api-config';
import {
  FIELD_CHANGED, CREATE_METRIC_SUCCESS, CREATE_METRIC_FAIL, GET_METRICS_SUCCESS,
  GET_METRICS_FAIL, DELETE_METRIC_PART_SUCCESS, DELETE_METRIC_PART_FAIL,
  CREATE_PROP_SUCCESS, CREATE_PROP_FAIL, DELETE_METRIC_SUCCESS, DELETE_METRIC_FAIL,
  OPEN_PROP_MODAL, CLOSE_PROP_MODAL
} from './metrics-types';

const { url, routes } = apiConfig;

export const fieldChanged = (id, newValue) => {
  return ({ type: FIELD_CHANGED, payload: { id, newValue } });
};

// Dispatch allows for javscript Promises to be returned
export const createMetric = (token, projectId, metricName, metricType) => (dispatch) => {
  return axios.post(`${url}${projectId}/${routes.getAndCreateMetrics}`, {
    name: metricName,
    metricParts: [],
    metricType, // shorthand for metricType: metricType
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: CREATE_METRIC_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: CREATE_METRIC_FAIL, payload: e.message });
  });
}

export const getMetrics = (token, projectId) => (dispatch) => {
  return axios.get(`${url}${projectId}/${routes.getAndCreateMetrics}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: GET_METRICS_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: GET_METRICS_FAIL, payload: e.message });
  });
};

export const removeMetricPart = (token, projectId, metricId, metricPartId) => (dispatch) => {
  return axios.delete(`${url}${projectId}/${routes.getAndCreateMetrics}/${metricId}/${routes.removeMetricPart}/${metricPartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: DELETE_METRIC_PART_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: DELETE_METRIC_PART_FAIL, payload: e.message });
  });
}

export const addProperties = (token, projectId, metricId, eventName, propName) => (dispatch) => {
  return axios.post(`${url}${projectId}/${routes.getAndCreateMetrics}/${metricId}`, {
    eventName,
    eventProperty: propName,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: CREATE_PROP_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: CREATE_PROP_FAIL, payload: e.message });
  });
};

export const removeMetric = (token, projectId, metricId) => (dispatch) => {
  return axios.delete(`${url}${projectId}/${routes.getAndCreateMetrics}/${metricId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return dispatch({ type: DELETE_METRIC_SUCCESS, payload: response.data });
  }).catch((e) => {
    return dispatch({ type: DELETE_METRIC_FAIL, payload: e.message });
  });
};

export const openPropModal = (metricId) => {
  return { type: OPEN_PROP_MODAL, payload: metricId };
};

export const closePropModal = () => {
  return { type: CLOSE_PROP_MODAL };
};
