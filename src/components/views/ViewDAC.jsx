import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import Balances from 'components/Balances';
import Loader from '../Loader';
import GoBackButton from '../GoBackButton';
import BackgroundImageHeader from '../BackgroundImageHeader';
import DonationList from '../DonationList';
import CommunityButton from '../CommunityButton';
import CampaignCard from '../CampaignCard';
import DAC from '../../models/DAC';
import ProfileCard from '../ProfileCard';
import { connect } from 'react-redux'
import { selectDac } from '../../redux/reducers/dacsSlice'
import { selectCampaignsByDac } from '../../redux/reducers/campaignsSlice';
import { fetchDonationsByIds, selectDonationsByEntity } from '../../redux/reducers/donationsSlice'
import DacCard from '../DacCard';
import { withTranslation } from 'react-i18next';
import Donate from '../Donate';

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
      isLoading: false,
      campaigns: []
    };
  }

  componentDidMount() {
    this.props.fetchDonationsByIds(this.props.dac.donationIds);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (JSON.stringify(this.props.dac.donationIds) !== JSON.stringify(prevProps.dac.donationIds)) {
      this.props.fetchDonationsByIds(this.props.dac.donationIds);
    }
  }

  render() {
    const { dac, campaigns, donations, balance, history, t } = this.props;
    const {
      isLoading,
      isLoadingCampaigns,
    } = this.state;

    if (isLoading) return <Loader className="fixed" />;
    if (!dac) return <div id="view-cause-view">Failed to load dac</div>;
    return (
      <div id="view-cause-view">
        <BackgroundImageHeader image={dac.imageCidUrl} height={300}>
          <h6>Decentralized Altruistic Community</h6>
          <h1>{dac.title}</h1>
          <Donate
            entityId={dac.id}
            entityCard={<DacCard dac={dac} />}
            title={t('donateDacTitle')}
            description={t('donateDacDescription')}
            enabled={dac.receiveFunds}>
          </Donate>
          {dac.url && (
            <CommunityButton className="btn btn-secondary" url={dac.url}>
              Join our community
            </CommunityButton>
          )}
        </BackgroundImageHeader>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 m-auto">
              <GoBackButton to="/" title="Communities" />

              <ProfileCard address={dac.delegateAddress} />

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
              <DonationList donations={donations}></DonationList>
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

ViewDAC.defaultProps = {
  dac: new DAC(),
};

const mapStateToProps = (state, ownProps) => {
  const dacId = parseInt(ownProps.match.params.id);
  return {
    dac: selectDac(state, dacId),
    campaigns: selectCampaignsByDac(state, dacId),
    donations: selectDonationsByEntity(state, dacId)
  }
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(ViewDAC)
)
