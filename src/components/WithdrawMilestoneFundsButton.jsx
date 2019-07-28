import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import MilestoneService from 'services/MilestoneService';
import Milestone from 'models/Milestone';
import User from 'models/User';
import { isLoggedIn } from 'lib/middleware';

class WithdrawMilestoneFundsButton extends Component {
  async withdraw() {
    const { milestone, currentUser } = this.props;

    try {
      await isLoggedIn(currentUser, false);
    } catch (e) {
      return;
    }

    MilestoneService.withdraw({
      milestone,
      from: currentUser.address,
      onConfirmation: () => {
        React.toast.info(<p>The milestone withdraw has been confirmed</p>);
      },
      onError: err => {
        React.swal({
          title: 'Oh no!',
          content: React.swal.msg('Failed to update withdraw', err),
          icon: 'error',
        });
      },
    });
  }

  render() {
    const { milestone, currentUser } = this.props;

    return (
      <Fragment>
        {currentUser &&
          [milestone.recipientAddress, milestone.ownerAddress].includes(currentUser.address) &&
          milestone.status === Milestone.COMPLETED && (
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => this.withdraw()}
            >
              <i className="fa fa-usd" />{' '}
              {milestone.recipientAddress === currentUser.address ? 'Collect' : 'Disburse'}
            </button>
          )}
      </Fragment>
    );
  }
}

WithdrawMilestoneFundsButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

export default WithdrawMilestoneFundsButton;
