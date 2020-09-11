import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import ReactHtmlParser from 'react-html-parser';
import BigNumber from 'bignumber.js';

import Balances from 'components/Balances';
import { feathersClient } from '../../lib/feathersClient';
import Loader from '../Loader';
import MilestoneCard from '../MilestoneCard';
import GoBackButton from '../GoBackButton';
import { isOwner } from '../../lib/helpers';
import { checkBalance } from '../../lib/middleware';
import BackgroundImageHeader from '../BackgroundImageHeader';
import DonateButton from '../DonateButton';
import Donate from '../Donate';
import Campaign from '../../models/Campaign';
import CommunityButton from '../CommunityButton';
import DelegateMultipleButton from '../DelegateMultipleButton';
import TableDonations from '../TableDonations';
import User from '../../models/User';
import ErrorBoundary from '../ErrorBoundary';
import { connect } from 'react-redux'
import { selectCampaign } from '../../redux/reducers/campaignsSlice'
import { selectMilestonesByCampaign } from '../../redux/reducers/milestonesSlice';
import { fetchDonationsByIds, selectDonationsByEntity } from '../../redux/reducers/donationsSlice'
import ProfileCard from '../ProfileCard';
import CampaignCard from '../CampaignCard';
import { withTranslation } from 'react-i18next';

/**
 * The Campaign detail view mapped to /campaing/id
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 * @param balance      User's current balance
 */
class ViewCampaign extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false,
      isLoadingMilestones: false,
      milestones: props.milestones,
      milestonesLoaded: 0,
      milestonesTotal: 0,
      milestonesPerBatch: 50
    };
  }

  componentDidMount() {
    this.setState({
      campaign: this.props.campaign,
      milestones: this.props.milestones,
      isLoading: false
    });
  }

  componentDidMount() {
    this.props.fetchDonationsByIds(this.props.campaign.donationIds);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (JSON.stringify(this.props.campaign.donationIds) !== JSON.stringify(prevProps.campaign.donationIds)) {
      this.props.fetchDonationsByIds(this.props.campaign.donationIds);
    }
  }

  removeMilestone(id) {
    checkBalance(this.props.balance)
      .then(() => {
        React.swal({
          title: 'Delete Milestone?',
          text: 'You will not be able to recover this milestone!',
          icon: 'warning',
          dangerMode: true,
        }).then(() => {
          const milestones = feathersClient.service('/milestones');
          milestones.remove(id);
        });
      })
      .catch(err => {
        if (err === 'noBalance') {
          // handle no balance error
        }
      });
  }

  render() {
    const { campaign, milestones, donations, history, currentUser, balance, t } = this.props;
    const {
      isLoading,
      isLoadingMilestones,
      milestonesLoaded,
      milestonesTotal
    } = this.state;
    if (!isLoading && !campaign) return <p>Unable to find a campaign</p>;
    return (
      <ErrorBoundary>
        <div id="view-campaign-view">
          {isLoading && <Loader className="fixed" />}

          {!isLoading && (
            <div>
              <BackgroundImageHeader image={campaign.imageCidUrl} height={300}>
                <h6>Campaign</h6>
                <h1>{campaign.title}</h1>
                {campaign.id && <DonateButton
                    entityType={Campaign.type}                    
                    entityId={campaign.id}
                    title={campaign.title}
                    enabled={campaign.receiveFunds}
                />}
                {<Donate
                  entityId={campaign.id}
                  entityCard={<CampaignCard campaign={campaign} />}
                  title={t('donateCampaignTitle')}
                  description={t('donateCampaignDescription')}
                  enabled={campaign.receiveFunds}
                ></Donate>}
                {currentUser && currentUser.authenticated && (
                  <DelegateMultipleButton
                    style={{ padding: '10px 10px' }}
                    campaign={campaign}
                    balance={balance}
                    currentUser={currentUser}
                  />
                )}
                {campaign.url && (
                  <CommunityButton className="btn btn-secondary" url={campaign.url}>
                    Join our community
                  </CommunityButton>
                )}
              </BackgroundImageHeader>

              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-8 m-auto">
                    <GoBackButton to="/" title="Campaigns" />
                    
                    <ProfileCard address={campaign.managerAddress}/>

                    <div className="card content-card ">
                      <div className="card-body content">
                        {ReactHtmlParser(campaign.description)}
                      </div>
                    </div>

                    <div className="milestone-header spacer-top-50 card-view">
                      <h3>Milestones</h3>
                      {isOwner(campaign.managerAddress, currentUser) && (
                        <Link
                          className="btn btn-primary btn-sm pull-right"
                          to={`/campaigns/${campaign.id}/milestones/new`}
                        >
                          Add Milestone
                        </Link>
                      )}

                      {!isOwner(campaign.managerAddress, currentUser) && currentUser && (
                        <Link
                          className="btn btn-primary btn-sm pull-right"
                          to={`/campaigns/${campaign.id}/milestones/propose`}
                        >
                          Propose Milestone
                        </Link>
                      )}

                      {isLoadingMilestones && milestonesTotal === 0 && (
                        <Loader className="relative" />
                      )}
                      <ResponsiveMasonry
                        columnsCountBreakPoints={{
                          0: 1,
                          470: 2,
                          900: 3,
                          1200: 4,
                        }}
                      >
                        <Masonry gutter="10px">
                          {milestones.map(m => (
                            <MilestoneCard
                              milestone={m}
                              currentUser={currentUser}
                              key={m.clientId}
                              history={history}
                              balance={balance}
                              removeMilestone={() => this.removeMilestone(m.clientId)}
                            />
                          ))}
                        </Masonry>
                      </ResponsiveMasonry>

                      {milestonesLoaded < milestonesTotal && (
                        <center>
                          <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => this.loadMoreMilestones()}
                            disabled={isLoadingMilestones}
                          >
                            {isLoadingMilestones && (
                              <span>
                                <i className="fa fa-circle-o-notch fa-spin" /> Loading
                              </span>
                            )}
                            {!isLoadingMilestones && <span>Load More</span>}
                          </button>
                        </center>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row spacer-top-50 spacer-bottom-50">
                  <div className="col-md-8 m-auto">
                    <Balances entity={campaign} />
                    <TableDonations donations={donations}/>
                  </div>
                </div>
                <div className="row spacer-top-50 spacer-bottom-50">
                  <div className="col-md-8 m-auto">
                    <h4>Campaign Reviewer</h4>
                    <ProfileCard address={campaign.reviewerAddress}/>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

ViewCampaign.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
};

ViewCampaign.defaultProps = {
  currentUser: undefined,
  campaign: new Campaign(),
  milestones: [],
  donations: []
};

const mapStateToProps = (state, ownProps) => {
  const campaignId = parseInt(ownProps.match.params.id);
  return {
    campaign: selectCampaign(state, campaignId),
    milestones: selectMilestonesByCampaign(state, campaignId),
    donations: selectDonationsByEntity(state, campaignId)
  }
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(ViewCampaign)
)