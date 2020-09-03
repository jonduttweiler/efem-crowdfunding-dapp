/* eslint-disable react/prefer-stateless-function */
// @dev: not prefering stateless here because functionality will be extended
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import User from 'models/User';
import BigNumber from 'bignumber.js';
import DeleteProposedMilestoneButton from 'components/DeleteProposedMilestoneButton';
import AcceptRejectProposedMilestoneButtons from 'components/AcceptRejectProposedMilestoneButtons';
import ReproposeRejectedMilestoneButton from 'components/ReproposeRejectedMilestoneButton';
import MilestoneCompleteButton from './MilestoneCompleteButton';
import ApproveRejectMilestoneCompletionButtons from 'components/ApproveRejectMilestoneCompletionButtons';
import MilestoneWithdrawButton from 'components/MilestoneWithdrawButton';

class MilestoneConversationAction extends Component {
  render() {
    const { messageContext, milestone, balance, currentUser } = this.props;

    switch (messageContext) {
      case 'proposed':
        return (
          <AcceptRejectProposedMilestoneButtons
            milestone={milestone}
            balance={balance}
            currentUser={currentUser}
          />
        );

      case 'rejected':
        return (
          <MilestoneCompleteButton
            milestone={milestone}
            balance={balance}
            currentUser={currentUser}
          />
        );

      case 'NeedsReview':
        return (
          <ApproveRejectMilestoneCompletionButtons
            milestone={milestone}
            balance={balance}
            currentUser={currentUser}
          />
        );

      case 'Completed':
        return (
          <MilestoneWithdrawButton
            milestone={milestone}
            balance={balance}
            currentUser={currentUser}
          />
        );

      case 'proposedRejected':
        return (
          <Fragment>
            <ReproposeRejectedMilestoneButton
              milestone={milestone}
              balance={balance}
              currentUser={currentUser}
            />
            <DeleteProposedMilestoneButton
              milestone={milestone}
              balance={balance}
              currentUser={currentUser}
            />
          </Fragment>
        );

      case 'proposedAccepted':
        return (
          <MilestoneCompleteButton
            milestone={milestone}
            balance={balance}
            currentUser={currentUser}
          />
        );
      default:
        return <Fragment />;
    }
  }
}

MilestoneConversationAction.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired,
  currentUser: PropTypes.instanceOf(User).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
  messageContext: PropTypes.string.isRequired,
};

export default MilestoneConversationAction;
