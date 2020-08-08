import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import ReactHtmlParser from 'react-html-parser';

import Balances from 'components/Balances';
import Loader from '../Loader';
import GoBackButton from '../GoBackButton';
import BackgroundImageHeader from '../BackgroundImageHeader';
import DonateButton from '../DonateButton';
import TableDonations from '../TableDonations';
import CommunityButton from '../CommunityButton';
import DACService from '../../services/DACService';
import CampaignCard from '../CampaignCard';
import DAC from '../../models/DAC';
import ProfileCard from '../ProfileCard';

/**
 * The DAC detail view mapped to /dac/id
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 */
class ViewDAC extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      isLoadingDonations: true,
      isLoadingCampaigns: true,
      campaigns: [],
      donations: [],
      donationsTotal: 0,
      donationsPerBatch: 50,
      newDonations: 0,
    };

    this.loadMoreDonations = this.loadMoreDonations.bind(this);
  }

  componentDidMount() {
    const dacId = this.props.match.params.id;
    this.loadDac(dacId);
    this.loadMoreDonations();
    // subscribe to donation count
    this.donationsObserver = DACService.subscribeNewDonations(
      dacId,
      newDonations =>
        this.setState({
          newDonations,
        }),
      () => this.setState({ newDonations: 0 }),
    );
  }

  async loadDac(dacId){
    try{
      const dac = await DACService.get(dacId);
      this.setState({ dac, isLoading: false});

      this.campaignObserver = DACService.subscribeCampaigns( //Busca las campaigns usando el delegateId???
        dac.delegateId,
        campaigns => this.setState({ campaigns, isLoadingCampaigns: false }),
        () => this.setState({ isLoadingCampaigns: false }), // TODO: inform user of error
      );

    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });// TODO: inform user of error
    }

  }
  
  componentWillUnmount() {
    if (this.donationsObserver) this.donationsObserver.unsubscribe();
    if (this.campaignObserver) this.campaignObserver.unsubscribe();
  }

  loadMoreDonations() {
    this.setState({ isLoadingDonations: true }, () =>
      DACService.getDonations(
        this.props.match.params.id,
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

  render() {
    const { balance, history } = this.props;
    const {
      isLoading,
      donations,
      dac,
      isLoadingDonations,
      campaigns,
      isLoadingCampaigns,
      donationsTotal,
      newDonations,
    } = this.state;
    
    if (isLoading) return <Loader className="fixed" />;
    if (!dac) return <div id="view-cause-view">Failed to load dac</div>;
    return (
      <div id="view-cause-view">
        <BackgroundImageHeader image={dac.imageCidUrl} height={300}>
          <h6>Decentralized Altruistic Community</h6>
          <h1>{dac.title}</h1>

          {<DonateButton
            model={{
              type: DAC.type,
              title: dac.title,
              entityId: dac.id
            }}
          />}

          {dac.communityUrl && (
            <CommunityButton className="btn btn-secondary" url={dac.communityUrl}>
              Join our community
            </CommunityButton>
          )}
        </BackgroundImageHeader>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 m-auto">
              <GoBackButton to="/" title="Communities" />

         {/*      <center>
                <Link to={`/profile/${dac.ownerAddress}`}>
                  <Avatar size={50} src={avatar} round />
                  <p className="small">{name}</p>
                </Link>
              </center> */}
              
              <ProfileCard address={dac.ownerAddress}/>

              <div className="card content-card">
                <div className="card-body content">{ReactHtmlParser(dac.description)}</div>
              </div>
            </div>
          </div>

          {(isLoadingCampaigns || campaigns.length > 0) && (
            <div className="row spacer-top-50 spacer-bottom-50">
              <div className="col-md-8 m-auto card-view">
                <h4>{campaigns.length} Campaign(s)</h4>
                <p>These Campaigns are working hard to solve the cause of this Fund </p>
                {isLoadingCampaigns && <Loader className="small" />}

                {campaigns.length > 0 && !isLoadingCampaigns && (
                  <div className="cards-grid-container">
                    {campaigns.map(c => (
                      <CampaignCard key={c.id} campaign={c} history={history} balance={balance} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="row spacer-top-50 spacer-bottom-50">
            <div className="col-md-8 m-auto">
              <Balances entity={dac} />
              <TableDonations entity={dac}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ViewDAC.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
};

ViewDAC.defaultProps = {};

export default ViewDAC;
