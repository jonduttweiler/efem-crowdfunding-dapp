/* eslint-disable react/prefer-stateless-function */
// @dev: not prefering stateless here because functionality will be extended
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import BigNumber from 'bignumber.js';

import DeleteProposedMilestoneButton from 'components/DeleteProposedMilestoneButton';
import AcceptRejectProposedMilestoneButtons from 'components/AcceptRejectProposedMilestoneButtons';
import ReproposeRejectedMilestoneButton from 'components/ReproposeRejectedMilestoneButton';
import RequestMarkMilestoneCompleteButton from 'components/RequestMarkMilestoneCompleteButton';
import CancelMilestoneButton from 'components/CancelMilestoneButton';
import ApproveRejectMilestoneCompletionButtons from 'components/ApproveRejectMilestoneCompletionButtons';
import WithdrawMilestoneFundsButton from './WithdrawMilestoneFundsButton';
import EditMilestoneButton from 'components/EditMilestoneButton';

class MilestoneActions extends Component {
  render() {
    const { milestone, user, balance } = this.props;

    return (
      <Fragment>
        {/*
        <AcceptRejectProposedMilestoneButtons
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}

        {/*
        <ReproposeRejectedMilestoneButton milestone={milestone} currentUser={currentUser} />
        */}

        {/*
        <RequestMarkMilestoneCompleteButton
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}

        {/*
        <CancelMilestoneButton
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}

        {/*
          <DeleteProposedMilestoneButton
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}

        {/*
        <ApproveRejectMilestoneCompletionButtons
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}

        <WithdrawMilestoneFundsButton
          milestone={milestone}
          balance={balance}
          user={user}/>

        {/*
        <EditMilestoneButton
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}
      </Fragment>
    );
  }
}

MilestoneActions.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
};

export default MilestoneActions;
