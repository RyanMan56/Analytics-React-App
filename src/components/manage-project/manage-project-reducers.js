import { REMOVE_ANALYSER_SUCCESS, GET_ANALYSER_SUCCESS } from './manage-project-types';

const INITIAL_STATE = {
  analysers: [],
  username: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ANALYSER_SUCCESS:
      return {
        ...state,
        analysers: action.payload,
      }
    default:
      return state;
  }
};
