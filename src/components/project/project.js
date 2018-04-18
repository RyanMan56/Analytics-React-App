import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Link, Redirect } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Logo } from '../common';
import { GET_USERS_SUCCESS, GET_USERS_FAIL } from './project-types';
import { white, pink, darkBlue } from '../../config/colors';
import * as classActions from './project-actions';
import * as userActions from '../user/user-actions';
import * as dashActions from '../dashboard/dashboard-actions';
import ViewDataModalContent from './view-data-modal-content';
import { GET_EVENTS_SUCCESS, GET_EVENTS_FAIL } from './project-types';
import './project.css';

const styles = {
  labelStyle: {
    fontSize: 20,
    color: pink,
  },
};

const modalStyle = {
  overlay: {

  },
  content: {
    display: 'flex',
    backgroundColor: darkBlue,
    color: white,
    fontFamily: 'Roboto, sans-serif',
  },
};

Modal.setAppElement('#root');

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notLoggedIn: false,
      projectNull: false,
      toMetrics: false,
      shouldManageProject: false,
    };
  }

  componentWillMount() {
    const loadedCookie = cookie.load('user');
    if (loadedCookie) {
      this.props.actions.setCookie(loadedCookie);
    } else {
      this.setState({ notLoggedIn: true });
      return;
    }
    if (this.props.dash.activeProjectId == null) {
      this.setState({ projectNull: true });
    }
    this.getEvents(loadedCookie, this.props.dash.activeProjectId);
    this.getUsers(loadedCookie, this.props.dash.activeProjectId);
  }

  getEvents(userCookie, projectId) {
    this.props.actions.getEvents(userCookie, projectId).then((response) => {
      if (response.type === GET_EVENTS_FAIL) {
        this.setState({ notLoggedIn: true });
        return;
      }
    });
  }

  getUsers(userCookie, projectId) {
    this.props.actions.getUsers(userCookie, projectId).then((response) => {
      if (response.type === GET_USERS_FAIL) {
        this.setState({ notLoggedIn: true });
        return;
      }
    });
  }

  formatTime(seconds) {
    const minutes = seconds / 60;
  	const hours = (minutes / 60).toFixed(0);
  	const remainderMins = (minutes % 60).toFixed(0);
  	return `${hours < 10 ? `0${hours}` : hours}h ${remainderMins < 10 ? `0${remainderMins}` : remainderMins}m`
  }

  formatDate(dateString) {
    var date = new Date(dateString);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var day = date.getDate();
    var month = date.getMonth() + 1;

    if (hours < 10) { hours = "0"+hours; }
    if (minutes < 10) { minutes = "0"+minutes; }
    if (day < 10) { day = "0"+day; }
    if (month < 10) { month = "0"+month; }

    var finalDate = hours + ":" + minutes + " " + day + "/" + month;
    return finalDate;
  }

  formatEvents(events) {
    const formattedEvents = events.map(e => {
      const date = this.formatDate(e.date);
      return {
        id: e.id,
        name: e.name,
        username: e.createdBy,
        date,
        data: 'Click to view',
      };
    });
    return formattedEvents;
  }

  openModal() {
    this.props.actions.openModal();
  }

  onCellClick(rowId, columnId) {
    const event = this.props.state.events[rowId];
    this.props.actions.setActiveEvent(event.id);
    this.openModal();
  }

  backToProjects() {
    this.props.actions.setActiveProject(null);
  }

  goToMetrics() {
    this.setState({ toMetrics: true });
  }

  manageProject() {
    this.setState({ shouldManageProject: true });
  }

  logout() {
    cookie.remove('user');
    this.props.actions.logout();
  }

  render() {
    const { projects, activeProjectId } = this.props.dash;
    const project = projects.find(p => p.id === activeProjectId);
    const name = project == null ? '' : project.name;
    const formattedEvents = this.formatEvents(this.props.state.events);

    return (
      <div className="container">
        {this.state.notLoggedIn &&
          <Redirect to="/" />
        }
        {(project == null || this.state.projectNull) &&
          <Redirect to="/dashboard" />
        }
        {this.state.toMetrics &&
          <Redirect to="/metrics" />
        }
        {this.state.shouldManageProject &&
          <Redirect to="/manage-project" />
        }
        <Modal
          isOpen={this.props.state.modalOpen}
          onRequestClose={this.props.actions.closeModal.bind(this)}
          style={modalStyle}
        >
          <ViewDataModalContent />
        </Modal>
        <div className="item nav">
          <Logo title={name} height={100} />
          <div className="heading-container">
            <FlatButton
              label="Back to Projects"
              labelStyle={styles.labelStyle}
              onClick={this.backToProjects.bind(this)}
            />
            <FlatButton
              label="Manage Project"
              labelStyle={styles.labelStyle}
              onClick={this.manageProject.bind(this)}
            />
            <FlatButton
              label="Logout"
              labelStyle={styles.labelStyle}
              onClick={this.logout.bind(this)}
            />
          </div>
        </div>
        <div className="item-body">
          <div className="body-section left">
            <div className="left-top section">
              <h3>Live Events</h3>
              <Table
                className="table"
                style={{ backgroundColor: darkBlue }}
                onCellClick={this.onCellClick.bind(this)}
              >
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                >
                  <TableRow>
                    <TableHeaderColumn className="table-header">Event</TableHeaderColumn>
                    <TableHeaderColumn className="table-header">User</TableHeaderColumn>
                    <TableHeaderColumn className="table-header">Date</TableHeaderColumn>
                    <TableHeaderColumn className="table-header">Data</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  { formattedEvents.map((e) => {
                      return (
                        <TableRow key={e.id}>
                          <TableRowColumn>{e.name}</TableRowColumn>
                          <TableRowColumn>{e.username}</TableRowColumn>
                          <TableRowColumn>{e.date}</TableRowColumn>
                          <TableRowColumn>{e.data}</TableRowColumn>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </div>
            <div className="left-bottom section">
              <h3>Users</h3>
              <Table
                className="table"
                style={{ backgroundColor: darkBlue }}
              >
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                >
                  <TableRow>
                    <TableHeaderColumn className="table-header">Username</TableHeaderColumn>
                    <TableHeaderColumn className="table-header">Last Active</TableHeaderColumn>
                    <TableHeaderColumn className="table-header">Usage (last 30 days)</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  { this.props.state.users.map((pu) => {
                      return (
                        <TableRow key={pu.id}>
                          <TableRowColumn>{pu.username}</TableRowColumn>
                          <TableRowColumn>{this.formatDate(pu.lastActive)}</TableRowColumn>
                          <TableRowColumn>{this.formatTime(pu.usage)}</TableRowColumn>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="body-section right">
            <div className="right-top metric-container">
              <div className="section metric-body">
                <h3>Tracked Metrics</h3>
                <Table
                  className="table"
                  style={{ backgroundColor: darkBlue }}
                >
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                  >
                    <TableRow>
                      <TableHeaderColumn className="table-header">Name</TableHeaderColumn>
                      <TableHeaderColumn className="table-header">Value</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    { /* If project isn't null, then render metrics */
                      project && project.metrics.map((m) => {
                        return (
                          <TableRow key={m.id}>
                            <TableRowColumn>{m.name}</TableRowColumn>
                            <TableRowColumn>{m.value}</TableRowColumn>
                          </TableRow>
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </div>
              <div className="metric-footer">
                <RaisedButton
                  className="button metric-btn"
                  label="Create & manage tracked metrics"
                  backgroundColor={pink}
                  style={styles.RaisedButtonStyle}
                  labelColor={darkBlue}
                  onClick={this.goToMetrics.bind(this)}
                />
              </div>
            </div>
            <div className="right-bottom section"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    state: state.proj,
    dash: state.dash,
  }),
  dispatch => ({
    // Actions placed later will override functions defined by previous actions
    actions: bindActionCreators({ ...userActions, ...dashActions, ...classActions }, dispatch),
  }),
)(Project);
