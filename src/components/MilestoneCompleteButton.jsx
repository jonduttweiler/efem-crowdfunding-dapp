import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Milestone from '../models/Milestone';
import Activity from '../models/Activity';
import User from 'models/User';
import ActivityModal from './ActivityModal';
import { connect } from 'react-redux'
import { complete } from '../redux/reducers/milestonesSlice';

class MilestoneCompleteButton extends Component {

  constructor() {
    super();
    this.activityModal = React.createRef();
  }

  requestMarkComplete() {
    const { milestone } = this.props;

    this.activityModal.current.openModal({
      title: 'Mark milestone complete',
      description: "Describe what you've done to finish the work of this milestone and attach proof if necessary. This information will be publicly visible and emailed to the reviewer.",
      required: false,
      cta: 'Mark complete',
      enableAttachProof: true,
      textPlaceholder: "Describe what you've done...",
    }).then(activity => {
      milestone.status = Milestone.COMPLETING;
      activity.action = Activity.ACTION_COMPLETE;
      this.props.complete({
        milestone,
        activity
      });
    });
  }

  render() {
    const { milestone, currentUser } = this.props;
    let showButton = milestone.isManager(currentUser) && milestone.isActive;
    let buttonLabel = 'Mark complete';
    return (
      <Fragment>
        {showButton && (
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => this.requestMarkComplete()}>
            {buttonLabel}
          </button>
        )}
        <ActivityModal ref={this.activityModal} milestone={milestone} />
      </Fragment>
    );
  }
}

MilestoneCompleteButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = { complete }

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneCompleteButton);
