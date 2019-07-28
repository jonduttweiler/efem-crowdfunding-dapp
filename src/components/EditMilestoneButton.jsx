import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import User from 'models/User';
import { history } from 'lib/helpers';

class EditMilestoneButton extends Component {
  editMilestone() {
    const { milestone } = this.props;

    if (['Proposed', 'Rejected'].includes(milestone.status)) {
      history.push(`/campaigns/${milestone.campaignId}/milestones/${milestone._id}/edit/proposed`);
    } else {
      history.push(`/campaigns/${milestone.campaignId}/milestones/${milestone._id}/edit`);
    }
  }

  render() {
    const { milestone, currentUser } = this.props;

    return (
      <Fragment>
        {currentUser &&
          (milestone.ownerAddress === currentUser.address ||
            milestone.campaign.ownerAddress === currentUser.address) &&
          ['Proposed', 'Rejected', 'InProgress', 'NeedsReview'].includes(milestone.status) && (
            <button type="button" className="btn btn-link" onClick={() => this.editMilestone()}>
              <i className="fa fa-edit" />
              &nbsp;Edit
            </button>
          )}
      </Fragment>
    );
  }
}

EditMilestoneButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

export default EditMilestoneButton;
