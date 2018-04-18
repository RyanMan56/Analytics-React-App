import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Modal from 'react-modal';
import { BounceLoader } from 'react-spinners';
import * as classActions from './metrics-actions';
import * as userActions from '../user/user-actions';
import { Logo, CustomTextField } from '../common';
import { white, pink, darkBlue, red } from '../../config/colors';
import AddMetricPropModal from './add-metric-prop-modal';
import './metrics.css';
import { CREATE_METRIC_FAIL, GET_METRICS_FAIL, DELETE_METRIC_SUCCESS } from './metrics-types';

const styles = {
  labelStyle: {
    fontSize: 20,
    color: pink,
  },
  smallLabelStyle: {
    fontSize: 16,
    color: pink,
  },
  removeLabelStyle: {
    fontSize: 16,
    color: red,
  },
  textFieldStyle: { width: 350, display: 'block' },
  menuItemStyle: {
    color: white,
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

class Metrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backToProject: false,
      errorMessage: '',
      createLoading: false,
      logout: false,
    };
  }

  componentWillMount() {
    this.getMetrics();
  }

  backToProject() {
    this.setState({ backToProject: true });
  }

  createMetric() {
    const { newMetricName, newMetricType } = this.props.state;
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    if (newMetricName === '' || newMetricType === '') {
      this.setState({ errorMessage: 'Metric name or type is invalid.' });
      return;
    }

    this.setState({ createLoading: true });

    this.props.actions.createMetric(userCookie, activeProjectId, newMetricName, newMetricType)
      .then((response) => {
        this.setState({ createLoading: false });
        if (response.type === CREATE_METRIC_FAIL) {
          this.setState({ errorMessage: 'Metric with the same name already exists.' });
        } else {
          this.getMetrics();
        }
      });
  }

  getMetrics() {
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    this.props.actions.getMetrics(userCookie, activeProjectId)
      .then((response) => {
        if (response.type === GET_METRICS_FAIL) {
          this.setState({ logout: true });
        }
      });
  }

  removeMetricProp(metricId, metricPartId) {
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    this.props.actions.removeMetricPart(userCookie, activeProjectId, metricId, metricPartId);
  }

  onFieldChanged(event, newValue) {
    this.props.actions.fieldChanged(event.target.id, newValue);
    this.setState({ errorMessage: '' });
  }

  addProperties(metricId) {
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    this.props.actions.openPropModal(metricId);
  }

  removeMetric(metricId) {
    const { activeProjectId } = this.props.dash;
    const userCookie = this.props.user.cookie;

    this.props.actions.removeMetric(userCookie, activeProjectId, metricId)
      .then((response) => {
        if (response.type === DELETE_METRIC_SUCCESS) {
          this.getMetrics();
        }
      });
  }

  onSelectionChanged(event, newValue) {
    let value;
    switch (newValue) {
      case 0:
        value = 'Accumulative';
        break;
      case 1:
        value = 'Average';
        break;
      case 2:
        value = 'Sum';
        break;
      default:
        return;
    }
    this.props.actions.fieldChanged('newMetricType', value);
  }

  render() {
    const { projects, activeProjectId } = this.props.dash;
    const { newMetricName, newMetricType, metrics } = this.props.state;
    const project = projects.find(p => p.id === activeProjectId);
    const name = project == null ? '' : project.name;

    // Provides live feedback whenever the modal closes
    if (this.props.state.shouldGetMetrics) {
      this.getMetrics();
    }

    return (
      <div className="container">
        {this.state.logout &&
          <Redirect to="/" />
        }
        {project == null &&
          <Redirect to="/dashboard" />
        }
        {this.state.backToProject &&
          <Redirect to="/project" />
        }
        <Modal
          isOpen={this.props.state.propModalOpen}
          onRequestClose={this.props.actions.closePropModal.bind(this)}
          style={modalStyle}
        >
          <AddMetricPropModal />
        </Modal>
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
          <div className="body-section left">
            <h3>Create Metric</h3>
            {!this.props.state.propModalOpen && // Otherwise the z-index is too high for the labels, so they go through the property modal
              <form className="create-metric" onSubmit={this.createMetric.bind(this)}>
                <CustomTextField
                  id="newMetricName"
                  floatingLabelText="Metric Name"
                  style={styles.textFieldStyle}
                  value={newMetricName}
                  onChange={this.onFieldChanged.bind(this)}
                />
                <SelectField
                  id="newMetricValue"
                  floatingLabelText="Metric Type"
                  value={newMetricType}
                  onChange={this.onSelectionChanged.bind(this)}
                  style={styles.textFieldStyle}
                  floatingLabelStyle={{ color: white }}
                  floatingLabelFocusStyle={{ color: pink }}
                  listStyle={{ backgroundColor: darkBlue }}
                  selectedMenuItemStyle={{ color: pink }}
                >
                  <MenuItem
                    value="Accumulative"
                    primaryText="Accumulative"
                    style={styles.menuItemStyle}
                  />
                  <MenuItem
                    value="Average"
                    primaryText="Average"
                    style={styles.menuItemStyle}
                  />
                  <MenuItem
                    value="Sum"
                    primaryText="Sum"
                    style={styles.menuItemStyle}
                  />
                </SelectField>
                <p className="error-message">{this.state.errorMessage}</p>
                <div style={styles.buttonContainerStyle}>
                  {this.state.createLoading
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
                      className="button metric-create-btn"
                      label="Create"
                      backgroundColor={pink}
                      style={styles.RaisedButtonStyle}
                      labelColor={darkBlue}
                      onClick={this.createMetric.bind(this)}
                    />
                  }
                </div>
              </form>
            }
          </div>
          <div className="body-section right metric-container">
            <h3>Manage Metrics</h3>
            <div className="manage-metrics">
              {metrics != null && metrics.map((m) => {
                return (
                  <div className="metric-item" key={m.id}>
                    <div className="property-container">
                      <p><span className="property-title">Name:</span> {m.name}</p>
                      <p><span className="property-title">Value:</span> {m.value}</p>
                      <div className="metric-parts">
                        {
                          m.metricParts.map((mp, i) => {
                            return (
                              <div key={mp.id} className="metric-part">
                                <span className="property-title prop-id">Prop {i + 1}: </span>
                                <FlatButton
                                  label="Remove"
                                  labelStyle={styles.removeLabelStyle}
                                  onClick={() => { this.removeMetricProp(m.id, mp.id); }}
                                />
                                <p><span className="property-title">Event Name:</span> {mp.eventName}</p>
                                <p><span className="property-title">Event Prop:</span> {mp.eventProperty}</p>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                    <div className="property-container">
                      <FlatButton
                        label="Add Property"
                        labelStyle={styles.smallLabelStyle}
                        onClick={() => { this.addProperties(m.id); }}
                      />
                      <FlatButton
                        label="Remove Metric"
                        labelStyle={styles.removeLabelStyle}
                        onClick={() => { this.removeMetric(m.id); }}
                      />
                    </div>
                  </div>
                );
              })}
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
    state: state.metrics,
    dash: state.dash,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...userActions, ...classActions }, dispatch),
  }),
)(Metrics);
