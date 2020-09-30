import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import classNames from "classnames";

import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import Balances from 'components/Balances';
import Loader from '../Loader';
import GoBackButton from '../GoBackButton';
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

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/views/dacView.js";

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
    const { classes, dac, campaigns, donations, balance, history, t } = this.props;
    const {
      isLoading,
      isLoadingCampaigns,
    } = this.state;

    const { ...rest } = this.props;

    if (isLoading) return <Loader className="fixed" />;
    if (!dac) return <div id="view-cause-view">Failed to load dac</div>;
    return (
      <div id="view-cause-view">
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
        <Parallax medium image={dac.imageCidUrl}>
          <div className="vertical-align">
            <center>
              <h6 className={classes.entityType}>{t('dac')}</h6>
              <h1 className={classes.entityName}>{dac.title}</h1>
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
            </center>
          </div>
        </Parallax>

        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <GoBackButton to="/" title="Communities" />

                  <ProfileCard address={dac.delegateAddress} />

                  <div className="card content-card">
                    <div className="card-body content">{ReactHtmlParser(dac.description)}</div>
                  </div>

                </GridItem>
              </GridContainer>

              {(isLoadingCampaigns || campaigns.length > 0) && (
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={8}>
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
                  </GridItem>
                </GridContainer>
              )}

              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <Balances entity={dac} />
                  <DonationList donations={donations}></DonationList>
                </GridItem>
              </GridContainer>

            </div>
          </div>
        </div>
        <Footer />
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
  withTranslation()(withStyles(styles)(ViewDAC))
)