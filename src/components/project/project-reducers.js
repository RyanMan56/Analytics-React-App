import {
  GET_EVENTS_SUCCESS, GET_PROPERTIES_SUCCESS, OPEN_MODAL, CLOSE_MODAL,
  SET_ACTIVE_EVENT, GET_USERS_SUCCESS, GET_USERS_FAIL,
} from './project-types';

const INITIAL_STATE = {
  events: [],
  properties: [],
  users: [],
  activeEventId: 0,
  modalOpen: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EVENTS_SUCCESS:
      return {
        ...state, events: action.payload,
      };
    case GET_PROPERTIES_SUCCESS:
      return {
        ...state, properties: action.payload,
      };
    case OPEN_MODAL:
      return {
        ...state,
        modalOpen: true,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false,
      };
    case SET_ACTIVE_EVENT:
      return {
        ...state,
        activeEventId: action.payload,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state, users: action.payload,
      };
    default:
      return state;
  }
};
