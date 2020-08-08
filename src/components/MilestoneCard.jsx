import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTruncatedText, isOwner, history } from '../lib/helpers';
import User from '../models/User';
import CardStats from './CardStats';
import GivethLogo from '../assets/logo.svg';
import Milestone from '../models/Milestone';
import ProfileCard from './ProfileCard';
import { connect } from 'react-redux'
import { selectCampaign } from '../redux/reducers/campaignsSlice'

/**
 * A single milestone
 */
class MilestoneCard extends Component {
  constructor(props) {
    super(props);

    this.viewMilestone = this.viewMilestone.bind(this);
    this.editMilestone = this.editMilestone.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
  }

  viewMilestone() {
    if(this.props.milestone.isPending) {
      React.toast.warn('Milestone is pending');
    } else {
      history.push(
        `/campaigns/${this.props.campaign.id}/milestones/${this.props.milestone.id}`,
      );
    }
  }

  viewProfile(e) {
    e.stopPropagation();
    history.push(`/profile/${this.props.milestone.managerAddress}`);
  }

  editMilestone(e) {
    e.stopPropagation();
  }

  render() {
    const { milestone, campaign, currentUser } = this.props;
    const colors = ['#76318f', '#50b0cf', '#1a1588', '#2A6813', '#95d114', '#155388', '#604a7d'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // TODO Ver cómo implementar esto de manera correcta.
    if(campaign == undefined) {
      return (
        <div></div>
      )
    }
    
    return (
      <div
        className="card milestone-card overview-card"
        onClick={this.viewMilestone}
        onKeyPress={this.viewMilestone}
        role="button"
        tabIndex="0"
      >
        <div className="card-body">
          <div
            className="card-avatar"
            onClick={this.viewProfile}
            onKeyPress={this.viewProfile}
            role="button"
            tabIndex="0"
          >
            <ProfileCard address={milestone.managerAddress}/>

            {((milestone && milestone.managerAddress && isOwner(milestone.managerAddress, currentUser)) ||
              isOwner(campaign.managerAddress, currentUser)) &&
              ['Proposed', 'Rejected', 'InProgress', 'NeedsReview'].includes(milestone.status) && (
                <span className="pull-right">
                  <button
                    type="button"
                    className="btn btn-link btn-edit"
                    onClick={e => this.editMilestone(e)}
                  >
                    <i className="fa fa-edit" />
                  </button>
                </span>
              )}
          </div>

          <div
            className="card-img"
            style={{
              backgroundColor: milestone.imageCidUrl ? 'white' : color,
              backgroundImage: `url(${milestone.imageCidUrl || GivethLogo})`,
            }}
          />

          <div className="card-content">
            <h4 className="card-title">{getTruncatedText(milestone.title, 40)}</h4>
            <div className="card-text">{getTruncatedText(milestone.description, 100)}</div>
          </div>

          <div className="card-footer">
            <CardStats
              type="milestone"
              fiatAmountTarget={milestone.fiatAmountTarget}
              status={milestone.status}
              donations={milestone.donationsCount}
            />
          </div>
        </div>
      </div>
    );
  }
}

MilestoneCard.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired,
  currentUser: PropTypes.instanceOf(User),
};

MilestoneCard.defaultProps = {
  currentUser: undefined,
};

const mapStateToProps = (state, ownProps) => {
  return {
    campaign: selectCampaign(state, ownProps.milestone.campaignId)
  }
}

export default connect(mapStateToProps)(MilestoneCard)