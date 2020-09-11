import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import BigNumber from 'bignumber.js';

import DeleteProposedMilestoneButton from 'components/DeleteProposedMilestoneButton';
import AcceptRejectProposedMilestoneButtons from 'components/AcceptRejectProposedMilestoneButtons';
import ReproposeRejectedMilestoneButton from 'components/ReproposeRejectedMilestoneButton';
import CancelMilestoneButton from 'components/CancelMilestoneButton';
import MilestoneWithdrawButton from './MilestoneWithdrawButton';
import MilestoneComplete from './MilestoneComplete';
import MilestoneApprove from './MilestoneApprove';
import MilestoneReject from './MilestoneReject';

class MilestoneActions extends Component {
  render() {
    const { milestone, user, balance } = this.props;

    return (
      <Fragment>
        <MilestoneComplete
          milestone={milestone}
          currentUser={user}>
        </MilestoneComplete>

        <MilestoneApprove
          milestone={milestone}
          currentUser={user}>
        </MilestoneApprove>

        <MilestoneReject
          milestone={milestone}
          currentUser={user}>
        </MilestoneReject>

        <MilestoneWithdrawButton
          milestone={milestone}
          balance={balance}
          user={user} />

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
