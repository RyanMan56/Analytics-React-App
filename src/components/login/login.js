import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import { BounceLoader } from 'react-spinners';
import * as classActions from './login-actions';
import * as userActions from '../user/user-actions';
import apiConfig from '../../config/api-config';
import './login.css';
import { Logo, CustomTextField } from '../common';
import { white, pink, darkBlue } from '../../config/colors';
import { LOGIN_FAIL, LOGIN_SUCCESS } from './login-types';

const styles = {
  checkboxStyle: { fill: white },
  buttonContainerStyle: { marginTop: 50, width: '100%' },
  textFieldStyle: { width: 350 },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginLoading: false,
      saved: false,
      toRegister: false,
    };
  }

  componentWillMount() {
    const loadedCookie = cookie.load('user');
    if (loadedCookie) {
      this.props.actions.setCookie(loadedCookie);
    }
  }

  onFieldChanged(event, newValue) {
    this.props.actions.credentialsChanged(event.target.id, newValue);
    this.setState({ errorMessage: '' });
  }

  login(event) {
    const { username, password } = this.props.state;
    this.setState({ loginLoading: true });
    this.props.actions.login(username, password).then((response) => {
      if (response.type == LOGIN_FAIL) {
        this.setState({ loginLoading: false });
        this.setState({ errorMessage: response.payload });
      } else if (response.type == LOGIN_SUCCESS) {
        cookie.save('user', response.payload.data.access_token);
        this.setState({ saved: true });
      }
    });
  }

  register(event) {
    this.setState({ toRegister: true });
  }

  render() {
    const { username, password } = this.props.state;

    return (
      <div className="container">
        {this.props.state.token && this.state.saved &&
          <Redirect to="/dashboard" />
        }
        {this.state.toRegister &&
          <Redirect to="/register" />
        }
        <div className="item logo-container">
          <Logo />
        </div>
        <div id="form-item" className="item">
          <form className="form" onSubmit={this.props.actions.login.bind(this)}>
            <CustomTextField
              id="username"
              floatingLabelText="Email"
              style={styles.textFieldStyle}
              value={username}
              onChange={this.onFieldChanged.bind(this)}
            />
            <CustomTextField
              id="password"
              floatingLabelText="Password"
              type="password"
              style={styles.textFieldStyle}
              value={password}
              onChange={this.onFieldChanged.bind(this)}
            />
            <Checkbox
              inputStyle={styles.checkboxStyle}
              iconStyle={styles.checkboxStyle}
              label="Remember me"
              style={{ marginTop: 20 }}
            />
            <p className="error-message">{this.state.errorMessage}</p>
            <div style={styles.buttonContainerStyle}>
              {this.state.loginLoading
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
                    label="Login"
                    backgroundColor={pink}
                    style={styles.RaisedButtonStyle}
                    labelColor={darkBlue}
                    onClick={this.login.bind(this)}
                  />
              }
              <RaisedButton
                className="button sign-up"
                label="Sign up"
                backgroundColor={darkBlue}
                style={styles.RaisedButtonStyle}
                labelColor={white}
                onClick={this.register.bind(this)}
              />
            </div>
          </form>
        </div>
        <div className="item"></div>
      </div>
    );
  }
}

export default connect(
  state => ({
    state: state.user,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...userActions, ...classActions }, dispatch),
  }),
)(Login);
