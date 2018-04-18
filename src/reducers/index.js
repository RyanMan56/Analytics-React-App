import { combineReducers } from 'redux';
import userReducer from '../components/user/user-reducers';
import dashboardReducer from '../components/dashboard/dashboard-reducers';
import projectReducer from '../components/project/project-reducers';
import metricsReducer from '../components/metrics/metrics-reducers';
import manageProjectReducer from '../components/manage-project/manage-project-reducers';
import { LOGOUT } from '../components/user/user-types';

const appReducer = combineReducers({
  user: userReducer,
  dash: dashboardReducer,
  proj: projectReducer,
  metrics: metricsReducer,
  manageProj: manageProjectReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined; // State set back to INITIAL_STATE when null
  }
  return appReducer(state, action);
};

export default rootReducer;
