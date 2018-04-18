const apiConfig = {
  url: 'http://localhost:54296/api/',
  routes: {
    analyserLogin: 'users/login?analyser=true',
    register: 'users/register',
    getProjects: '',
    createProject: 'create',
    getEvents: 'event',
    getProperties: 'properties',
    getProjectUsers: 'users',
    getAndCreateMetrics: 'metric',
    removeMetricPart: 'property',
    manageAnalysers: 'analyser',
  },
};

export default apiConfig;
