import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import * as classActions from './project-actions';
import * as userActions from '../user/user-actions';
import { white, pink, darkBlue } from '../../config/colors';
import './project.css';

class ViewDataModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventNull: false,
    };
  }

  componentWillMount() {
    if (this.props.dash.activeProjectId == null) {
      this.setState({ eventNull: true });
      return;
    }
    const { activeProjectId } = this.props.dash;
    const token = this.props.user.cookie;
    const { activeEventId } = this.props.state;
    this.props.actions.getEventProperties(token, activeProjectId, activeEventId)
      .then((response) => {
      });
  }

  render() {
    const { properties } = this.props.state;
    return (
      <div className="container">
        <div className="property-body">
          <h3>Event Properties</h3>
          {properties.map((property, i) => {
            return (
              <div className="property-container" key={i}>
                <p><span className="property-title">Name:</span> {property.name}</p>
                <p><span className="property-title">Value:</span> {property.value}</p>
                <p><span className="property-title">DataType:</span> {property.dataType}</p>
              </div>
            );
          })}
        </div>
        <div className="property-footer">
          <RaisedButton
            className="button secondary property-back"
            label="Back"
            backgroundColor={darkBlue}
            labelColor={white}
            onClick={this.props.actions.closeModal.bind(this)}
          />
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
    actions: bindActionCreators({ ...userActions, ...classActions }, dispatch),
  }),
)(ViewDataModalContent);
