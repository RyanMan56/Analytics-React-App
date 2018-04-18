import {
  GET_PROJECTS_SUCCESS, GET_PROJECTS_FAIL, OPEN_MODAL, CLOSE_MODAL,
  CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAIL, SET_ACTIVE_PROJECT,
} from './dashboard-types';

const INITIAL_STATE = {
  projects: [],
  errorMessage: '',
  modalOpen: false,
  shouldGetProjects: false,
  activeProjectId: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.payload,
        shouldGetProjects: false,
      };
    case GET_PROJECTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        shouldGetProjects: false,
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
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        shouldGetProjects: true,
        modalOpen: false,
      };
    case CREATE_PROJECT_FAIL:
      return {
        ...state,
      };
    case SET_ACTIVE_PROJECT:
      return {
        ...state,
        activeProjectId: action.payload,
      };
    default: return state;
  }
};
