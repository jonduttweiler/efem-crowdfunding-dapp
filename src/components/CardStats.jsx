import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import FiatAmount from './FiatAmount';

/**
 * Shows the statistics on DACs, Campaigns and milestonesCount
 *
 * TODO: Check the properties that are passed, sometimes they are number, sometimes strings...
 */
const CardStats = ({
    fiatAmountTarget,
    donations,
    type,
    status }) => (
      
  <div className="row card-stats">

    <div className="col text-left">
      <p>Donations</p>
      <p>{donations}</p>
    </div>

    {type === 'milestone' && (
      <div className="col text-center card-center">
        {fiatAmountTarget && (
          <span>
            <p>Target</p>
            <FiatAmount amount={fiatAmountTarget}/>
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
  status: PropTypes.string,
  fiatAmountTarget: PropTypes.instanceOf(BigNumber),  
  donations: PropTypes.number.isRequired
};

CardStats.defaultProps = {
  status: 'In Progress',
  fiatAmountTarget: new BigNumber('0'),
  donations: 0
};

export default CardStats;
