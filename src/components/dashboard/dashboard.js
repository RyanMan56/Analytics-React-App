import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import cookie from 'react-cookies';
import { Link, Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import * as classActions from './dashboard-actions';
import * as userActions from '../user/user-actions';
import { Logo } from '../common';
import { white, pink, darkBlue } from '../../config/colors';
import { GET_PROJECTS_FAIL } from './dashboard-types';
import CreateProjectModalContent from './create-project-modal-content';
import './dashboard.css';

const styles = {
  labelStyle: {
    fontSize: 20,
    color: pink,
  },
  tableHeaderStyle: {
    color: pink,
  }
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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notLoggedIn: false,
      formattedProjects: [],
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
    this.getProjects(loadedCookie);
  }

  getProjects(cookie) {
    this.props.actions.getProjects(cookie).then((response) => {
      if (response.type === GET_PROJECTS_FAIL) {
        this.setState({ notLoggedIn: true });
        return;
      }
    });
  }

  // Get value of metric from its JSON data
  getMetricValue(metricName, p) {
    let metric = p.metrics.find(m => m.name == metricName);
    if (metric) {
      metric = metric.value;
    } else {
      metric = 0;
    }
    return metric;
  }

  // Convert the projects into a more condensed format for the table
  formatProjects(projects) {
    var formattedProjects = projects.map(p => {
      return {
        id: p.id,
        apiKey: p.apiKey,
        name: p.name,
        acquisition: this.getMetricValue('Acquisition', p),
        activation: this.getMetricValue('Activation', p),
        retention: this.getMetricValue('Retention', p),
        referrals: this.getMetricValue('Referrals', p),
        revenue: this.getMetricValue('Revenue', p),
      };
    });
    return formattedProjects;
  }

  createProject() {
    this.props.actions.openModal();
  }

  onCellClick(rowId) {
    const project = this.props.state.projects[rowId];
    this.props.actions.setActiveProject(project.id);
  }

  logout() {
    cookie.remove('user');
    this.setState({ notLoggedIn: true });
    this.props.actions.logout();
  }

  render() {
    var formattedProjects = this.formatProjects(this.props.state.projects);

    if (this.props.state.shouldGetProjects) {
      this.getProjects(this.props.user.cookie);
    }

    return (
      <div className="container">
        {this.state.notLoggedIn &&
          <Redirect to="/" />
        }
        {this.props.state.activeProjectId &&
          <Redirect to="/project" />
        }
        <Modal
          isOpen={this.props.state.modalOpen}
          onRequestClose={this.props.actions.closeModal.bind(this)}
          style={modalStyle}
        >
          <CreateProjectModalContent />
        </Modal>
        <div className="item nav">
          <Logo title="Projects" height={100} />
          <div className="heading-container">
            <FlatButton
              label="Logout"
              labelStyle={styles.labelStyle}
              onClick={this.logout.bind(this)}
            />
          </div>
        </div>
        <div className="item-table">
          <Table className="table" style={{ backgroundColor: darkBlue }}
              onCellClick={this.onCellClick.bind(this)}
            >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
                <TableHeaderColumn className="table-header">Project Name</TableHeaderColumn>
                <TableHeaderColumn className="table-header">Acquisition (last 30 days)</TableHeaderColumn>
                <TableHeaderColumn className="table-header">Activation (last 30 days)</TableHeaderColumn>
                <TableHeaderColumn className="table-header">Retention (last 30 days)</TableHeaderColumn>
                <TableHeaderColumn className="table-header">Referrals (last 30 days)</TableHeaderColumn>
                <TableHeaderColumn className="table-header">Revenue (last 30 days)</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              { formattedProjects.map(p => {
                  return <TableRow key={p.id}>
                    <TableRowColumn>{p.name}</TableRowColumn>
                    <TableRowColumn>{p.acquisition}</TableRowColumn>
                    <TableRowColumn>{p.activation}</TableRowColumn>
                    <TableRowColumn>{p.retention}</TableRowColumn>
                    <TableRowColumn>{p.referrals}</TableRowColumn>
                    <TableRowColumn>{p.revenue}</TableRowColumn>
                  </TableRow>
                })
              }
            </TableBody>
          </Table>
        </div>
        <div className="item footer">
          <RaisedButton
            className="new-button"
            label="New project"
            backgroundColor={pink}
            labelColor={darkBlue}
            onClick={this.createProject.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    state: state.dash,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...userActions, ...classActions }, dispatch),
  }),
)(Dashboard);
