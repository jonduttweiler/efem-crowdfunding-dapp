import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Milestone from '../models/Milestone';
import Activity from '../models/Activity';
import User from 'models/User';
import ActivityModal from './ActivityModal';
import { connect } from 'react-redux'
import { review } from '../redux/reducers/milestonesSlice';

class MilestoneReviewButtons extends Component {
  constructor() {
    super();
    this.activityModal = React.createRef();
  }

  approve() {
    const { milestone } = this.props;
    this.activityModal.current
      .openModal({
        title: 'Approve milestone completion',
        description: 'Optionally explain why you approve the completion of this milestone. Compliments are appreciated! This information will be publicly visible and emailed to the milestone owner.',
        textPlaceholder: 'Optionally explain why you approve the completion of this milestone...',
        required: false,
        cta: 'Approve completion',
        enableAttachProof: false,
      })
      .then(activity => {
        milestone.status = Milestone.APPROVING;
        activity.action = Activity.ACTION_APPROVE;
        this.props.review({
          milestone,
          activity
        });
      });
  }

  reject() {
    const { milestone } = this.props;

    this.activityModal.current
      .openModal({
        title: 'Reject milestone completion',
        description: 'Explain why you rejected the completion of this milestone. This information will be publicly visible and emailed to the milestone owner.',
        textPlaceholder: 'Explain why you rejected the completion of this milestone...',
        required: true,
        cta: 'Reject completion',
        enableAttachProof: false,
      })
      .then(activity => {
        milestone.status = Milestone.REJECTING;
        activity.action = Activity.ACTION_REJECT;
        this.props.review({
          milestone,
          activity
        });
      });
  }

  render() {
    const { milestone, currentUser } = this.props;
    let showButtons = milestone.isReviewer(currentUser) && milestone.isCompleted;
    let buttonApproveLabel = 'Approve';
    let buttonRejectLabel = 'Reject';
    return (
      <Fragment>
        {showButtons && (
          <span>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => this.approve()}
            >
              <i className="fa fa-thumbs-up" />&nbsp;{buttonApproveLabel}
            </button>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => this.reject()}
            >
              <i className="fa fa-thumbs-down" />&nbsp;{buttonRejectLabel}
            </button>
          </span>
        )}
        <ActivityModal ref={this.activityModal} milestone={milestone} />
      </Fragment>
    );
  }
}

MilestoneReviewButtons.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = { review }

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneReviewButtons);
