/* eslint-disable react/prefer-stateless-function */
// @dev: not prefering stateless here because functionality will be extended
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import BigNumber from 'bignumber.js';

import DeleteProposedMilestoneButton from 'components/DeleteProposedMilestoneButton';
import AcceptRejectProposedMilestoneButtons from 'components/AcceptRejectProposedMilestoneButtons';
import ReproposeRejectedMilestoneButton from 'components/ReproposeRejectedMilestoneButton';
import MilestoneCompleteButton from './MilestoneCompleteButton';
import CancelMilestoneButton from 'components/CancelMilestoneButton';
import MilestoneReviewButtons from './MilestoneReviewButtons';
import MilestoneWithdrawButton from './MilestoneWithdrawButton';
import EditMilestoneButton from 'components/EditMilestoneButton';
import MilestoneComplete from './MilestoneComplete';

class MilestoneActions extends Component {
  render() {
    const { milestone, user, balance } = this.props;

    return (
      <Fragment>

        {
          <MilestoneComplete milestone={milestone}></MilestoneComplete>
        }
        {/*
        <AcceptRejectProposedMilestoneButtons
          milestone={milestone}
          balance={balance}
          currentUser={currentUser}/>
        */}

        {/*
        <ReproposeRejectedMilestoneButton milestone={milestone} currentUser={currentUser} />
        */}

        {<MilestoneCompleteButton
          milestone={milestone}
          balance={balance}
          currentUser={user}/>}

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

        {
        <MilestoneReviewButtons
          milestone={milestone}
          balance={balance}
          currentUser={user}/>
        }

        <MilestoneWithdrawButton
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
