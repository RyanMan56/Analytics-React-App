import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cookie from 'react-cookies';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { BounceLoader } from 'react-spinners';
import { Logo, CustomTextField } from '../common';
import { white, pink, darkBlue } from '../../config/colors';
import * as userActions from '../user/user-actions';
import * as loginActions from '../login/login-actions';
import apiConfig from '../../config/api-config';
import { LOGIN_FAIL, LOGIN_SUCCESS } from '../login/login-types';
import './register.css';

const { url, routes } = apiConfig;

const styles = {
  checkboxStyle: { fill: white },
  buttonContainerStyle: { marginTop: 50, width: '25%' },
  textFieldStyle: { width: 350 },
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errorMessage: '',
      toLogin: false,
    };
  }

  onFieldChanged(event, newValue) {
    this.setState({ errorMessage: '', [event.target.id]: newValue });
  }

  toLogin() {
    this.setState({ toLogin: true });
  }

  register() {
    const { username, name, password, confirmPassword } = this.state;

    if (username === '' || name === '' || password === '' || confirmPassword === '') {
      this.setState({ errorMessage: 'Not all values have been filled in.' });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ errorMessage: 'Passwords do not match.' });
      return;
    }

    this.setState({ loading: true });

    axios.post(`${url}${routes.register}`, {
      username,
      name,
      password,
      confirmPassword,
      securityQuestion: 'default',
      securityAnswer: 'default',
    }).then((response) => {
      this.props.actions.login(username, password)
        .then((response) => {
          if (response.type === LOGIN_FAIL) {
            this.setState({ loading: false, errorMessage: response.payload });
          } else if (response.type === LOGIN_SUCCESS) {
            cookie.save('user', response.payload.data.access_token);
            this.setState({ saved: true });
          }
        })
    }).catch((e) => {
      this.setState({ loading: false, errorMessage: e.message });
    });
  }

  render() {
    const { username, name, password, confirmPassword } = this.state;

    return (
      <div className="container register-container">
        {this.props.state.token && this.state.saved &&
          <Redirect to="/dashboard" />
        }
        {this.state.toRegister &&
          <Redirect to="/" />
        }
        <div className="wrapped-container">
          <div className="item logo-container">
            <Logo title="Register" outerStyle={{ margin: '0 auto' }} />
          </div>
          <div className="item">
            <form className="form" onSubmit={this.register.bind(this)}>
              <CustomTextField
                id="username"
                floatingLabelText="Email"
                style={styles.textFieldStyle}
                value={username}
                onChange={this.onFieldChanged.bind(this)}
              />
              <CustomTextField
                id="name"
                floatingLabelText="Full Name"
                style={styles.textFieldStyle}
                value={name}
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
              <CustomTextField
                id="confirmPassword"
                floatingLabelText="Confirm Password"
                type="password"
                style={styles.textFieldStyle}
                value={confirmPassword}
                onChange={this.onFieldChanged.bind(this)}
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
                      label="Register"
                      backgroundColor={pink}
                      style={styles.RaisedButtonStyle}
                      labelColor={darkBlue}
                      onClick={this.register.bind(this)}
                    />
                }
                <RaisedButton
                  className="button sign-up"
                  label="Cancel"
                  backgroundColor={darkBlue}
                  style={styles.RaisedButtonStyle}
                  labelColor={white}
                  onClick={this.toLogin.bind(this)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    state: state.user,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...userActions, ...loginActions }, dispatch),
  }),
)(Register);
