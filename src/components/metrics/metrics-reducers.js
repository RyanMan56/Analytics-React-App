import {
  FIELD_CHANGED, CREATE_METRIC_SUCCESS, GET_METRICS_SUCCESS, DELETE_METRIC_PART_SUCCESS,
  CREATE_PROP_SUCCESS, DELETE_METRIC_SUCCESS, OPEN_PROP_MODAL, CLOSE_PROP_MODAL
} from './metrics-types';

const INITIAL_STATE = {
  newMetricName: '',
  newMetricType: '',
  metrics: [],
  propModalOpen: false,
  activeMetricId: null,
  shouldGetMetrics: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FIELD_CHANGED:
      return {
        ...state,
        [action.payload.id]: action.payload.newValue,
      };
    case CREATE_METRIC_SUCCESS:
      return {
        ...state,
        newMetricName: INITIAL_STATE.newMetricName,
        newMetricType: INITIAL_STATE.newMetricType,
      };
    case GET_METRICS_SUCCESS:
      return {
        ...state,
        metrics: action.payload,
        shouldGetMetrics: false,
      };
    case OPEN_PROP_MODAL:
      return {
        ...state,
        activeMetricId: action.payload,
        propModalOpen: true,
      };
    case CLOSE_PROP_MODAL:
      return {
        ...state,
        activeMetricId: null,
        propModalOpen: false,
        shouldGetMetrics: true,
      };
    case DELETE_METRIC_PART_SUCCESS:
      return {
        ...state,
        shouldGetMetrics: true,
      };
    default:
      return state;
  }
};
