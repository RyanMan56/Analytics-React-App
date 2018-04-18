import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Login from './login/login';
import Register from './register/register';
import Dashboard from './dashboard/dashboard';
import ManageProject from './manage-project/manage-project';
import Project from './project/project';
import Metrics from './metrics/metrics';
import { pink, darkBlue, white, purple } from '../config/colors';
// import Register from './register/register';

export default class App extends Component {
  render() {
    const muiTheme = getMuiTheme({
      palette: {
        primary1color: pink,
        textColor: white,
        borderColor: purple,
      },
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/project" component={Project} />
          <Route exact path="/metrics" component={Metrics} />
          <Route exact path="/manage-project" component={ManageProject} />
        </Switch>
      </MuiThemeProvider>
    );
  }
}
