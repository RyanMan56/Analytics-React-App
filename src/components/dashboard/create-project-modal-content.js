import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import { BounceLoader } from 'react-spinners';
import { CustomTextField, Logo } from '../common';
import * as classActions from './dashboard-actions';
import * as userActions from '../user/user-actions';
import { pink, darkBlue, white } from '../../config/colors';
import './create-project-modal-content.css';
import { CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAIL } from './dashboard-types';

const styles = {
  textFieldStyle: { width: 350 },
  buttonContainerStyle: { marginTop: 50, width: 350 },
};

class CreateProjectModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  }

  onFieldChanged(event, newValue) {
    this.setState({
      [event.target.id]: newValue,
      errorMessage: '',
    });
  }

  createProject(event) {
    const { name, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ errorMessage: 'Passwords do not match.' });
      return;
    }
    this.setState({ loading: true });
    this.props.actions.createProject(name, password, this.props.user.cookie)
      .then((response) => {
        if (response.type === CREATE_PROJECT_FAIL) {
          this.setState({ loading: false, errorMessage: response.payload });
        }
      });
  }

  render() {
    const { name, password, confirmPassword } = this.state;
    return (
      <div className="container center-container">
        <Logo title="Create Project" outerStyle={{ margin: 0 }} />
        <form className="form" onSubmit={this.createProject.bind(this)}>
          <CustomTextField
            id="name"
            floatingLabelText="Project Name"
            value={name}
            onChange={this.onFieldChanged.bind(this)}
            style={styles.textFieldStyle}
          />
          <CustomTextField
            id="password"
            floatingLabelText="Project Password"
            value={password}
            type="password"
            onChange={this.onFieldChanged.bind(this)}
            style={styles.textFieldStyle}
          />
          <CustomTextField
            id="confirmPassword"
            floatingLabelText="Confirm Password"
            value={confirmPassword}
            type="password"
            onChange={this.onFieldChanged.bind(this)}
            style={styles.textFieldStyle}
          />
          <p className="error-message">{this.state.errorMessage}</p>
          <div style={styles.buttonContainerStyle}>
            {this.state.loading
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
                  className="button"
                  label="Create"
                  backgroundColor={pink}
                  style={styles.RaisedButtonStyle}
                  labelColor={darkBlue}
                  onClick={this.createProject.bind(this)}
                />
            }
            <RaisedButton
              className="button secondary"
              label="Cancel"
              backgroundColor={darkBlue}
              style={styles.RaisedButtonStyle}
              labelColor={white}
              onClick={this.props.actions.closeModal.bind(this)}
            />
          </div>
        </form>
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
)(CreateProjectModalContent);
