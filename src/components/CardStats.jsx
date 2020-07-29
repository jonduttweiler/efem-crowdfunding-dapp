import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import config from '../configuration';

/**
 * Shows the statistics on DACs, Campaigns and milestonesCount
 *
 * TODO: Check the properties that are passed, sometimes they are number, sometimes strings...
 */
const CardStats = ({ peopleCount, maxAmount, totalDonated, type, status, token }) => (
  <div className="row card-stats">

    <div className="col text-left">
      <p>Givers</p>
      <span>
        <i className="fa fa-male" />
        {peopleCount}
      </span>
    </div>

    {['dac', 'campaign'].includes(type) && (
      <div className="col text-center card-center">
        <span>
          <p>Donations</p>
          <p>{totalDonated.toFixed()}</p>
        </span>
      </div>
    )}

    {type === 'milestone' && (
      <div className="col text-center card-center">
        {maxAmount && (
          <span>
            <p>Requested</p>
            <p>
              {maxAmount} {token.symbol}
            </p>
          </span>
        )}
      </div>
    )}

    <div className="col-4 text-right">
      <p>Status</p>
      <span>
        <i className="fa fa-check-circle" />
        {status}
      </span>
    </div>
    
  </div>
);

CardStats.propTypes = {
  type: PropTypes.string.isRequired,
  peopleCount: PropTypes.number.isRequired,
  status: PropTypes.string,
  maxAmount: PropTypes.string,
  totalDonated: PropTypes.instanceOf(BigNumber),
  token: PropTypes.shape(),
};

CardStats.defaultProps = {
  status: 'In Progress',
  maxAmount: '0',
  totalDonated: new BigNumber('0'),
  token: {
    symbol: config.nativeTokenName,
  },
};

export default CardStats;
