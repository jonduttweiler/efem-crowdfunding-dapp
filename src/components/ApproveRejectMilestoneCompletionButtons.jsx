/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import User from 'models/User';
import MilestoneService from 'services/MilestoneService';
import ErrorPopup from 'components/ErrorPopup';
import ConversationModal from 'components/ConversationModal';

class ApproveRejectMilestoneCompletionButtons extends Component {
  constructor() {
    super();
    this.conversationModal = React.createRef();
  }

  approveMilestoneCompleted() {
    const { milestone } = this.props;

    this.conversationModal.current
      .openModal({
        title: 'Approve milestone completion',
        description:
          'Optionally explain why you approve the completion of this milestone. Compliments are appreciated! This information will be publicly visible and emailed to the milestone owner.',
        textPlaceholder: 'Optionally explain why you approve the completion of this milestone...',
        required: false,
        cta: 'Approve completion',
        enableAttachProof: false,
      })
      .then(proof => {
        MilestoneService.approveMilestoneCompletion({
          milestone,
          proof,
          onConfirmation: txUrl => {
            React.toast.success(
              <p>
                The milestone has been approved!
                <br />
                <a href={txUrl} target="_blank" rel="noopener noreferrer">
                  View transaction
                </a>
              </p>,
            );
          },
          onError: err => {
            ErrorPopup('Failed to approve milestone completion', err);
          },
        });
      });
  }

  rejectMilestoneCompleted() {
    const { milestone } = this.props;

    this.conversationModal.current
      .openModal({
        title: 'Reject milestone completion',
        description:
          'Explain why you rejected the completion of this milestone. This information will be publicly visible and emailed to the milestone owner.',
        textPlaceholder: 'Explain why you rejected the completion of this milestone...',
        required: true,
        cta: 'Reject completion',
        enableAttachProof: false,
      })
      .then(proof => {
        MilestoneService.rejectMilestoneCompletion({
          milestone,
          proof,
          onConfirmation: txUrl => {
            React.toast.success(
              <p>
                The milestone's completion has been rejected.
                <br />
                <a href={txUrl} target="_blank" rel="noopener noreferrer">
                  View transaction
                </a>
              </p>,
            );
          },
          onError: err => {
            ErrorPopup('Failed to reject milestone completion', err);
          },
        });
      });
  }

  render() {
    const { milestone, currentUser } = this.props;

    return (
      <Fragment>
        {currentUser &&
          milestone.reviewerAddress === currentUser.address &&
          milestone.status === 'NeedsReview' && (
            <span>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => this.approveMilestoneCompleted()}
              >
                <i className="fa fa-thumbs-up" />
                &nbsp;Approve
              </button>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => this.rejectMilestoneCompleted()}
              >
                <i className="fa fa-thumbs-down" />
                &nbsp;Reject
              </button>
            </span>
          )}

        <ConversationModal ref={this.conversationModal} milestone={milestone} />
      </Fragment>
    );
  }
}

ApproveRejectMilestoneCompletionButtons.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

export default ApproveRejectMilestoneCompletionButtons;
