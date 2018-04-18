import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import { BounceLoader } from 'react-spinners';
import { CustomTextField, Logo } from '../common';
import * as classActions from './metrics-actions';
import * as userActions from '../user/user-actions';
import { pink, darkBlue, white } from '../../config/colors';
import { CREATE_PROP_SUCCESS } from './metrics-types';

const styles = {
  textFieldStyle: { width: 350 },
  buttonContainerStyle: { marginTop: 50, width: 350 },
};

class AddMetricPropModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      propName: '',
      errorMessage: '',
    };
  }

  onFieldChanged(event, newValue) {
    this.setState({
      [event.target.id]: newValue,
      errorMessage: '',
    });
  }

  addProp() {
    const { eventName, propName } = this.state;
    const { activeMetricId } = this.props.state;
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    if (eventName === '') {
      this.setState({ errorMessage: 'Event name can not be empty.' });
      return;
    }

    this.setState({ loading: true });

    this.props.actions.addProperties(userCookie, activeProjectId, activeMetricId, eventName, propName)
      .then((response) => {
        this.setState({ loading: false });
        if (response.type === CREATE_PROP_SUCCESS) {
          this.props.actions.closePropModal();
        } else {
          this.setState({ errorMessage: response.payload });
        }
      })
  }

  render() {
    const { eventName, propName } = this.state;

    return (
      <div className="container center-container">
        <Logo title="Add Property" outerStyle={{ margin: 0 }} />
        <form className="form" onSubmit={this.addProp.bind(this)}>
          <CustomTextField
            id="eventName"
            floatingLabelText="Event Name"
            value={eventName}
            onChange={this.onFieldChanged.bind(this)}
            style={styles.textFieldStyle}
          />
          <CustomTextField
            id="propName"
            floatingLabelText="Property Name (optional)"
            value={propName}
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
                  label="Add"
                  backgroundColor={pink}
                  style={styles.RaisedButtonStyle}
                  labelColor={darkBlue}
                  onClick={this.addProp.bind(this)}
                />
            }
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    state: state.metrics,
    dash: state.dash,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...userActions, ...classActions }, dispatch),
  }),
)(AddMetricPropModal);
