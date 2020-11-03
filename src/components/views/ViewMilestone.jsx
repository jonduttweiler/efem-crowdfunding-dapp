import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import BigNumber from 'bignumber.js';
import User from 'models/User';
import MilestoneActions from '../MilestoneActions';
import Donate from '../Donate';
import GoBackButton from '../GoBackButton';
import DonationList from '../DonationList';
import Loader from '../Loader';
import ActivityList from '../ActivityList';
import Milestone from '../../models/Milestone';
import { connect } from 'react-redux'
import { selectCampaign } from '../../redux/reducers/campaignsSlice'
import { selectMilestone } from '../../redux/reducers/milestonesSlice';
import FiatAmount from '../FiatAmount';
import ProfileCard from '../ProfileCard';
import Campaign from '../../models/Campaign';
import StatusIndicator from '../StatusIndicator';
import { selectDonationsByEntity } from '../../redux/reducers/donationsSlice'
import { fetchActivitiesByIds, selectActivitiesByMilestone } from '../../redux/reducers/activitiesSlice'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import DateViewer from '../DateViewer';
import MilestoneCard from '../MilestoneCard';

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/views/milestoneView.js";
import { withTranslation } from 'react-i18next';
import DonationsBalance from '../DonationsBalance';

class ViewMilestone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //isLoading: true,
      isLoading: false,
      isLoadingDonations: true,
      donations: [],
      recipient: {},
      campaign: props.campaign,
      milestone: props.milestone,
      donationsTotal: 0,
      donationsPerBatch: 50,
      newDonations: 0,
    };
  }

  componentDidMount() {
    this.props.fetchActivitiesByIds(this.props.milestone.activityIds);
    //this.props.fetchDonationsByIds(this.props.milestone.donationIds);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    /*if (JSON.stringify(this.props.milestone.donationIds) !== JSON.stringify(prevProps.milestone.donationIds)) {
      this.props.fetchDonationsByIds(this.props.milestone.donationIds);
    }*/
    if (JSON.stringify(this.props.milestone.activityIds) !== JSON.stringify(prevProps.milestone.activityIds)) {
      this.props.fetchActivitiesByIds(this.props.milestone.activityIds);
    }
  }

  isActiveMilestone() {
    return this.state.milestone.status === 'InProgress';
  }

  renderDescription() {
    return ReactHtmlParser(this.props.milestone.description, {
      transform(node, index) {
        if (node.attribs && node.attribs.class === 'ql-video') {
          return (
            <div className="video-wrapper" key={index}>
              {convertNodeToElement(node, index)}
            </div>
          );
        }
        return undefined;
      },
    });
  }

  render() {
    const { classes, donations, activities, history, user, campaign, milestone, t } = this.props;
    const { ...rest } = this.props;

    const {
      isLoading,
      isLoadingDonations,
      //campaign,
      //milestone,
      recipient,
      donationsTotal,
      newDonations,
    } = this.state;

    return (
      <div id="view-milestone-view">
        {isLoading && <Loader className="fixed" />}

        {!isLoading && (
          <div>
            <Header
              color="white"
              brand="Give for forests"
              rightLinks={<MainMenu />}
              fixed
              changeColorOnScroll={{
                height: 0,
                color: "white"
              }}
              {...rest}
            />
            <Parallax medium image={milestone.imageCidUrl}>
              <div className="vertical-align">
                <center>
                <h6 className={classes.entityType}>{t('milestone')}</h6>
                  <h1 className={classes.entityName}>{milestone.title}</h1>

                  {!milestone.status === 'InProgress' && <p>This milestone is not active anymore</p>}

                  <h6 className={classes.entityType}>Campaign: {campaign.title}</h6>

                  <div className="milestone-actions">
                    <Donate
                      entityId={milestone.id}
                      entityCard={<MilestoneCard milestone={milestone} />}
                      title={t('donateMilestoneTitle')}
                      description={t('donateMilestoneDescription')}
                      enabled={milestone.canReceiveFunds}>  
                    </Donate>
                    {/*this.isActiveMilestone() && (
                      <Fragment>
                        {user && (
                          <DelegateMultipleButton
                            milestone={milestone}
                            campaign={campaign}
                            balance={balance}
                            user={user}
                          />
                        )}
                      </Fragment>
                    )*/}

                    {/* Milestone actions */}

                    {user && (
                      <MilestoneActions milestone={milestone} user={user} />
                    )}
                  </div>
                </center>
              </div>
            </Parallax>

            <div className={classNames(classes.main, classes.mainRaised)}>
              <div>
                <div className={classes.container}>

                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={8}>
                      <GoBackButton
                        history={history}
                        styleName="inline"
                        title={`Campaign: ${campaign.title}`}
                      />

                      <ProfileCard address={milestone.managerAddress} />

                      <div className="card content-card">
                        <div className="card-body content">{this.renderDescription()}</div>
                      </div>

                    </GridItem>
                  </GridContainer>

                  <GridContainer justify="center" className="spacer-top-50">
                    <GridItem xs={12} sm={12} md={8}>

                      <h4>Details</h4>

                      <div className="card details-card">
                        <div>
                          <span className="label">Reviewer</span>
                          <small className="form-text">
                            This person will review the actual completion of the Milestone
                          </small>
                          <ProfileCard address={milestone.reviewerAddress} namePosition="right" />
                        </div>


                        <div className="form-group">
                          <span className="label">Recipient</span>
                          <small className="form-text">
                            Where the funds go after successful completion of the Milestone
                          </small>
                          <ProfileCard address={milestone.recipientAddress} namePosition="right" />
                        </div>

                        {milestone.date && (
                          <div className="form-group">
                            <span className="label">Date of milestone</span>
                            <small className="form-text">
                              This date defines the fiat conversion rate
                            </small>
                            <DateViewer value={milestone.date} />
                          </div>
                        )}

                        <div className="form-group">
                          <span className="label">Target amount to raise</span>
                          <small className="form-text">
                            The maximum amount that can be donated to this Milestone. Based on the
                            requested amount in fiat.
                          </small>
                          <FiatAmount amount={milestone.fiatAmountTarget} />
                        </div>

                        <div className="form-group">
                          <span className="label">Amount donated</span>
                          <small className="form-text">
                            The amount currently donated to this Milestone
                          </small>
                          {/*milestone.currentBalance.toString()*/}
                        </div>

                        <div className="form-group">
                          <span className="label">Campaign</span>
                          <small className="form-text">
                            The campaign this milestone belongs to.
                          </small>
                          {campaign.title}
                        </div>

                        <div className="form-group">
                          <span className="label">Status</span>
                          <br />
                          <StatusIndicator status={milestone.status}></StatusIndicator>
                        </div>
                      </div>
                    </GridItem>
                  </GridContainer>

                  <GridContainer justify="center" className="spacer-top-50">
                    <GridItem xs={12} sm={12} md={8}>
                      <ActivityList activities={activities} />
                    </GridItem>
                  </GridContainer>

                  <GridContainer justify="center" className="spacer-top-50">
                    <GridItem xs={12} sm={12} md={8}>
                      <DonationList donationIds={milestone.budgetDonationIds}></DonationList>
                    </GridItem>
                  </GridContainer>

                  <GridContainer justify="center" className="spacer-top-50">
                    <GridItem xs={12} sm={12} md={8}>
	                    <DonationsBalance donationIds={milestone.budgetDonationIds} fiatTarget={milestone.fiatAmountTarget}></DonationsBalance>
                    </GridItem>
                  </GridContainer>

                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

ViewMilestone.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.instanceOf(User),
  balance: PropTypes.instanceOf(BigNumber).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      milestoneId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

ViewMilestone.defaultProps = {
  user: undefined,
  milestone: new Milestone(),
  campaign: new Campaign(),
  donations: []
};

const mapStateToProps = (state, ownProps) => {
  const reduxProps = {
    user: undefined,
    milestone: undefined,
    campaign: undefined,
    donations: []
  }
  reduxProps.user = selectCurrentUser(state);
  const milestoneId = parseInt(ownProps.match.params.milestoneId);
  reduxProps.milestone = selectMilestone(state, milestoneId);
  if (reduxProps.milestone) {
    reduxProps.campaign = selectCampaign(state, reduxProps.milestone.campaignId);
  }
  reduxProps.donations = selectDonationsByEntity(state, milestoneId);
  reduxProps.activities = selectActivitiesByMilestone(state, milestoneId);
  return reduxProps;
}

const mapDispatchToProps = { fetchActivitiesByIds }

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation() (ViewMilestone)))
)