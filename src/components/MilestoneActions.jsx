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
    const { milestone, user } = this.props;

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
          user={user} />

        {/*
        <AcceptRejectProposedMilestoneButtons
          milestone={milestone}
          currentUser={currentUser}/>
        */}
        {/*
        <ReproposeRejectedMilestoneButton milestone={milestone} currentUser={currentUser} />
        */}
        {/*
        <CancelMilestoneButton
          milestone={milestone}
          currentUser={currentUser}/>
        */}
        {/*
          <DeleteProposedMilestoneButton
          milestone={milestone}
          currentUser={currentUser}/>
        */}

        {/*
        <EditMilestoneButton
          milestone={milestone}
          currentUser={currentUser}/>
        */}
      </Fragment>
    );
  }
}

MilestoneActions.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired
};

export default MilestoneActions;
