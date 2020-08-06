import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import Avatar from 'react-avatar';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import User from 'models/User';

import MilestoneActions from 'components/MilestoneActions';
import { getUserAvatar, getUserName } from '../../lib/helpers';

import BackgroundImageHeader from '../BackgroundImageHeader';
import DonateButton from '../DonateButton';
import GoBackButton from '../GoBackButton';
import TableDonations from '../TableDonations';
import Loader from '../Loader';
import MilestoneConversations from '../MilestoneConversations';
// import DelegateMultipleButton from '../DelegateMultipleButton';
import MilestoneService from '../../services/MilestoneService';
import Milestone from '../../models/Milestone';
import config from '../../configuration';
import { connect } from 'react-redux'
import { selectCampaign } from '../../redux/reducers/campaignsSlice'
import { selectMilestone } from '../../redux/reducers/milestonesSlice';

/**
  Loads and shows a single milestone

  @route params:
    milestoneId (string): id of a milestone
* */

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

    this.loadMoreDonations = this.loadMoreDonations.bind(this);
  }

  componentDidMount() {
    const { milestoneId } = this.props.match.params;

    /*MilestoneService.subscribeOne(
      milestoneId,
      milestone =>
        this.setState({
          milestone,
          isLoading: false,
          campaign: new Campaign(milestone.campaign),
          recipient: milestone.recipient,
        }),
      err => {
        ErrorPopup('Something went wrong with viewing the milestone. Please try a refresh.', err);
        this.setState({ isLoading: false });
      },
    );*/

    this.loadMoreDonations();
    // subscribe to donation count
    this.donationsObserver = MilestoneService.subscribeNewDonations(
      milestoneId,
      newDonations =>
        this.setState({
          newDonations,
        }),
      () => this.setState({ newDonations: 0 }),
    );
  }

  componentWillUnmount() {
    this.donationsObserver.unsubscribe();
  }

  loadMoreDonations() {
    this.setState({ isLoadingDonations: true }, () =>
      MilestoneService.getDonations(
        this.props.match.params.milestoneId,
        this.state.donationsPerBatch,
        this.state.donations.length,
        (donations, donationsTotal) =>
          this.setState(prevState => ({
            donations: prevState.donations.concat(donations),
            isLoadingDonations: false,
            donationsTotal,
          })),
        () => this.setState({ isLoadingDonations: false }),
      ),
    );
  }

  isActiveMilestone() {
    return this.state.milestone.status === 'InProgress';
  }

  renderDescription() {
    return ReactHtmlParser(this.state.milestone.description, {
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
    const { history, currentUser, balance } = this.props;
    const {
      isLoading,
      donations,
      isLoadingDonations,
      campaign,
      milestone,
      recipient,
      donationsTotal,
      newDonations,
    } = this.state;

    return (
      <div id="view-milestone-view">
        {isLoading && <Loader className="fixed" />}

        {!isLoading && (
          <div>
            <BackgroundImageHeader image={milestone.imageCidUrl} height={300}>
              <h6>Milestone</h6>
              <h1>{milestone.title}</h1>

              {!milestone.status === 'InProgress' && <p>This milestone is not active anymore</p>}

              <p>Campaign: {campaign.title} </p>

              <div className="milestone-actions">
                {<DonateButton
                  model={{
                    type: Milestone.type,
                    title: milestone.title,
                    entityId: milestone.id,
                    token: { symbol: config.nativeTokenName }
                  }}
                  currentUser={currentUser}
                />}
                {/*this.isActiveMilestone() && (
                  <Fragment>
                    {currentUser && (
                      <DelegateMultipleButton
                        milestone={milestone}
                        campaign={campaign}
                        balance={balance}
                        currentUser={currentUser}
                      />
                    )}
                  </Fragment>
                )*/}

                {/* Milestone actions */}

                {currentUser && currentUser.authenticated && (
                  <MilestoneActions milestone={milestone} balance={balance} />
                )}
              </div>
            </BackgroundImageHeader>

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <div>
                    <GoBackButton
                      history={history}
                      styleName="inline"
                      title={`Campaign: ${campaign.title}`}
                    />

                    <center>
                      <Link to={`/profile/${milestone.managerAddress}`}>
                        <Avatar size={50} src={getUserAvatar(milestone.managerAddress)} round />
                        <p className="small">{getUserName(milestone.managerAddress)}</p>
                      </Link>
                    </center>

                    <div className="card content-card">
                      <div className="card-body content">{this.renderDescription()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row spacer-top-50">
                <div className="col-md-8 m-auto">
                  <div className="row">
                    <div className="col-md-6">
                      <h4>Details</h4>

                      <div className="card details-card">
                        <div className="form-group">
                          <span className="label">Reviewer</span>
                          <small className="form-text">
                            This person will review the actual completion of the Milestone
                          </small>

                          <table className="table-responsive">
                            <tbody>
                              <tr>
                                <td className="td-user">
                                  <Link to={`/profile/${milestone.reviewerAddress}`}>
                                    <Avatar
                                      size={30}
                                      src={getUserAvatar(milestone.reviewerAddress)}
                                      round
                                    />
                                    {getUserName(milestone.reviewerAddress)}
                                  </Link>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="form-group">
                          <span className="label">Recipient</span>
                          <small className="form-text">
                            Where the funds go after successful completion of the Milestone
                          </small>

                          <table className="table-responsive">
                            <tbody>
                              <tr>
                                <td className="td-user">
                                  <Link to={`/profile/${milestone.recipientAddress}`}>
                                    <Avatar size={30} src={getUserAvatar(milestone.recipientAddress)} round />
                                    {getUserName(milestone.recipientAddress)}
                                  </Link>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {milestone.date && (
                          <div className="form-group">
                            <span className="label">Date of milestone</span>
                            <small className="form-text">
                              This date defines the fiat conversion rate
                            </small>
                            {moment.utc(milestone.date).format('Do MMM YYYY')}
                          </div>
                        )}

                        <div className="form-group">
                          <span className="label">Target amount to raise</span>
                          <small className="form-text">
                            The maximum amount that can be donated to this Milestone. Based on the
                            requested amount in fiat.
                          </small>
                          ({milestone.fiatAmountTarget.toString()} {milestone.fiatType})
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
                          {milestone.status}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h4>Status updates</h4>

                      <MilestoneConversations milestone={milestone} balance={balance} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row spacer-top-50 spacer-bottom-50">
                <div className="col-md-8 m-auto">
                  <TableDonations entityId={milestone.id}/>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

ViewMilestone.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  balance: PropTypes.instanceOf(BigNumber).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      milestoneId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

ViewMilestone.defaultProps = {
  currentUser: undefined,
};

const mapStateToProps = (state, ownProps) => {
  const { milestoneId } = ownProps.match.params;
  let milestone = selectMilestone(state, milestoneId);
  return {
    milestone: milestone,
    campaign: selectCampaign(state, milestone.campaignId),
  }
}

export default connect(mapStateToProps)(ViewMilestone)