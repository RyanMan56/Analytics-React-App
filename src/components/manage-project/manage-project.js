import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { BounceLoader } from 'react-spinners';
import apiConfig from '../../config/api-config';
import * as classActions from './manage-project-actions';
import * as userActions from '../user/user-actions';
import * as dashActions from '../dashboard/dashboard-actions';
import { Logo, CustomTextField } from '../common';
import { white, pink, darkBlue, red } from '../../config/colors';
import { REMOVE_ANALYSER_SUCCESS, GET_ANALYSER_FAIL, ADD_ANALYSER_FAIL } from './manage-project-types';
import './manage-project.css';

const { url, routes } = apiConfig;

const styles = {
  labelStyle: {
    fontSize: 20,
    color: pink,
  },
  removeLabelStyle: {
    fontSize: 16,
    color: red,
  },
  textFieldStyle: { width: 350, display: 'block', marginLeft: 50 },
};

class ManageProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backToProject: false,
      addLoading: false,
      newAnalyserName: '',
    };
  }

  componentWillMount() {
    this.getAnalysers();
  }

  onFieldChanged(event, newValue) {
    this.setState({ errorMessage: '', [event.target.id]: newValue });
  }

  backToProject() {
    this.setState({ backToProject: true });
  }

  addAnalyser() {
    const { activeProjectId } = this.props.dash;
    const { newAnalyserName } = this.state;
    const userCookie = this.props.user.cookie;

    if (newAnalyserName === '') {
      this.setState({ errorMessage: 'Analyser username can not be empty.' });
    }

    this.props.actions.addAnalyser(userCookie, activeProjectId, newAnalyserName)
      .then((response) => {
        if (response.type === ADD_ANALYSER_FAIL) {
          this.setState({ errorMessage: 'User is already analyser of this project.' });
          return;
        }
        this.getAnalysers();
      });
  }

  removeAnalyser(analyserId) {
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    this.props.actions.removeAnalyser(userCookie, activeProjectId, analyserId)
      .then((response) => {
        if (response.type === REMOVE_ANALYSER_SUCCESS) {
          this.getAnalysers();
        }
      });
  }

  getAnalysers() {
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    this.props.actions.getAnalysers(userCookie, activeProjectId)
      .then((response) => {
        if (response.type === GET_ANALYSER_FAIL) {
          this.backToProject();
        }
      });
  }

  render() {
    const { newAnalyserName } = this.state;
    const { projects, activeProjectId } = this.props.dash;
    const project = projects.find(p => p.id === activeProjectId);
    const name = project == null ? '' : project.name;

    return (
      <div className="container">
        {(project == null || !project.analysers) &&
          <Redirect to="/dashboard" />
        }
        {this.state.backToProject &&
          <Redirect to="/project" />
        }
        <div className="item nav">
          <Logo title={name} height={100} />
          <div className="heading-container">
            <FlatButton
              label="Back to Projects"
              labelStyle={styles.labelStyle}
              onClick={this.backToProject.bind(this)}
            />
          </div>
        </div>
        <div className="item-body">
          <div className="body-section left manage-proj-section">
            <h3>Manage Analysers</h3>
            <div className="manage-section">
              <div className="property-container manage-prop-container">
                {
                  this.props.state.analysers.map((a) => {
                    return (
                      <p key={a.id}><span className="property-title">{a.name}</span> - {a.username}
                        <FlatButton
                          label="Remove"
                          labelStyle={styles.removeLabelStyle}
                          onClick={() => { this.removeAnalyser(a.id); }}
                        />
                      </p>
                    );
                  })
                }
              </div>
              <h3 className="add-analyser">Add Analyser</h3>
              <CustomTextField
                id="newAnalyserName"
                floatingLabelText="Analyser Username"
                style={styles.textFieldStyle}
                value={newAnalyserName}
                onChange={this.onFieldChanged.bind(this)}
              />
              <p className="error-message">{this.state.errorMessage}</p>
              <div style={styles.buttonContainerStyle}>
                {this.state.addLoading
                  ?
                    <div className="loader-container">
                      <BounceLoader
                        size={38}
                        color={pink}
                        loading
                        style={{ width: 38 }}
                      />
                    </div>
                  :
                    <RaisedButton
                      className="button manage-add-btn"
                      label="Add Analyser"
                      backgroundColor={pink}
                      style={styles.RaisedButtonStyle}
                      labelColor={darkBlue}
                      onClick={this.addAnalyser.bind(this)}
                    />
                }
              </div>
            </div>
          </div>
          <div className="body-section right manage-proj-section">
            <h3>Linking to Code</h3>
            <div className="instructions-container">
              <p className="instructions">To begin recording your own analytic data first make sure to send a <span className="pink">HTTP Post</span> request to:</p>
              <p className="pink">{url}{routes.getProjectUsers}/{routes.login}</p>
              <p>The body of the request acceps the <span className="pink">x-www-form-urlencoded</span> content type. The required attributes are:</p>
              <div className="manage-items">
                <p><span className="pink">username</span>: Accepts the API key of the project you&apos;re attaching the user to.</p>
                <p><span className="pink">password</span>: Accepts the password of the project you&apos;re attaching the user to.</p>
                <p><span className="pink">grant_type</span>: Keep this value as <span className="pink">password</span>. This is the auth type for the backend system.</p>
                <p><span className="pink">display</span>: The username of the project user. It can be whatever&apos;s relevant to your domain.</p>
                <p>This will begin a session, and will return you an <span className="pink">access_token</span>. This is your user&apos;s authentication.</p>
              </div>
              <p>Now you are able to record any events by sending a <span className="pink">HTTP Post</span> request to:</p>
              <p className="pink">{url}{routes.getProjectUsers}/{routes.getEvents}</p>
              <p>Make sure to attach the bearer token as a header to your reqest, in the format of <span className="pink">Bearer [TOKEN]</span> without the square brackets. The token will expire after an hour, so make sure to handle that.</p>
              <p>When sending an event, the body again accepts the <span className="pink">x-www-form-urlencoded</span> content type. These are the required parameters:</p>
              <div className="manage-items">
                <p><span className="pink">apiKey</span>: As mentioned, this is used to identify your project.</p>
                <p><span className="pink">name</span>: The name of the request.</p>
                <p><span className="pink">properties</span>: An <span>array</span> of event properties.</p>
              </div>
              <p>A property requires the following parameters:</p>
              <div className="manage-items">
                <p><span className="pink">name</span>: The property name.</p>
                <p><span className="pink">value</span>: The value of the property.</p>
                <p><span className="pink">DataType</span>: Can be either <span className="pink">Text</span> or <span className="pink">Number</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    state: state.manageProj,
    dash: state.dash,
  }),
  dispatch => ({
    // Actions placed later will override functions defined by previous actions
    actions: bindActionCreators({ ...userActions, ...dashActions, ...classActions }, dispatch),
  }),
)(ManageProject);
