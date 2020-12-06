import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTruncatedText, isOwner, history } from '../lib/helpers';
import User from '../models/User';
import CardStats from './CardStats';
import Milestone from '../models/Milestone';
import ProfileCardMini from './ProfileCardMini';
import { connect } from 'react-redux'
import { selectCampaign } from '../redux/reducers/campaignsSlice'
import messageUtils from '../redux/utils/messageUtils'

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.js";
import { cardTitle } from "assets/jss/material-kit-react.js";
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import DonationsBalanceMini from './DonationsBalanceMini';
import StatusBanner from './StatusBanner';

const styles = {
  ...imagesStyles,
  cardTitle,
};

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
      messageUtils.addMessageWarn({ text: 'El milestone no ha sido confirmado aún.' });
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
    const { classes, t, milestone, campaign, currentUser } = this.props;
    const colors = ['#76318f', '#50b0cf', '#1a1588', '#2A6813', '#95d114', '#155388', '#604a7d'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // TODO Ver cómo implementar esto de manera correcta.
    if(campaign == undefined) {
      return (
        <div></div>
      )
    }
    
    return (
      <Card
        onClick={this.viewMilestone}
        onKeyPress={this.viewMilestone}
        role="button"
        tabIndex="0"
      >
        <div
          className="card-avatar spacer-top-10"
          onClick={this.viewProfile}
          onKeyPress={this.viewProfile}
          role="button"
          tabIndex="0"
        >
        
        <ProfileCardMini address={milestone.managerAddress} namePosition="right"/>

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
          style={{
            backgroundColor: milestone.imageCidUrl ? 'white' : color,
            backgroundImage: `url(${milestone.imageCidUrl})`}}
          className={classes.cardImg}/>

        <CardBody>
          <h4 className={classes.cardTitle}>{getTruncatedText(milestone.title, 40)}</h4>
          <p>{getTruncatedText(milestone.description, 100)}</p>
        </CardBody>

        <DonationsBalanceMini
          donationIds={milestone.budgetDonationIds}
          fiatTarget={milestone.fiatAmountTarget}>
        </DonationsBalanceMini>

        <StatusBanner status={milestone.status} />

        <div className="card-footer">
          <CardStats
            type="milestone"
            fiatAmountTarget={milestone.fiatAmountTarget}
            status={milestone.status}
            donations={milestone.budgetDonationsCount}
          />
        </div>

      </Card>
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

export default connect(mapStateToProps)(withTranslation()(withStyles(styles)(MilestoneCard)))