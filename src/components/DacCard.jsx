import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getTruncatedText, history } from '../lib/helpers';
import CardStats from './CardStats';
import DAC from '../models/DAC';
import config from '../configuration';

/**
 * DAC Card visible in the DACs view.
 *
 * @param currentUser  Currently logged in user information
 */
class DacCard extends Component {
  constructor(props) {
    super(props);

    this.viewDAC = this.viewDAC.bind(this);
  }

  viewDAC() {
    if (this.props.dac.isPending) {
      React.toast.warn('Dac is pending');
    } else {
      history.push(`/dacs/${this.props.dac.id}`);
    }
  }

  render() {
    const { dac } = this.props;

    return (
      <div
        className="card overview-card"
        id={dac.id}
        onClick={this.viewDAC}
        onKeyPress={this.viewDAC}
        role="button"
        tabIndex="0"
      >
        <div className="card-body">
          <div className="card-img" style={{ backgroundImage: `url(${dac.imageCidUrl})` }} />

          <div className="card-content">
            <h4 className="card-title">{getTruncatedText(dac.title, 40)}</h4>
            <div className="card-text">{getTruncatedText(dac.description,100)}</div>
          </div>

          <div className="card-footer">
            <CardStats
              type="dac"
              peopleCount={dac.peopleCount}
              totalDonated={dac.totalDonationCount}
              currentBalance={dac.currentBalance}
              status={dac.status}
              token={{ symbol: config.nativeTokenName, decimals: 18 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

DacCard.propTypes = {
  dac: PropTypes.instanceOf(DAC).isRequired,
};

DacCard.defaultProps = {};

export default DacCard;
