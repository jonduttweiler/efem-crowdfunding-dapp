import React, { Component } from 'react';
import CampaignCard from '../CampaignCard';
import Loader from '../Loader';
import { connect } from 'react-redux'
import { selectCampaigns } from '../../redux/reducers/campaignsSlice'
import { withTranslation } from 'react-i18next';

/**
 * The Campaigns view mapped to /campaigns
 */
class Campaigns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const { t, campaigns } = this.props;
    const { isLoading, hasError } = this.state;
    // TODO Por incorporación de Redux, se fija el total
    // como el tamaño de las campañas.
    // Falta el desarrollo del Paginado.
    var total = campaigns.length;
    return (
      <div id="campaigns-view" className="card-view">
        <div className="container-fluid page-layout reduced-padding">
          <h4>{t('campaigns')} {total > 0 && <span className="badge badge-success">{total}</span>}</h4>
          {// There are some Campaigns in the system, show them
          !hasError && campaigns.length > 0 && (
            <div>
              <p>
                Nuestros emprendimientos de vida
              </p>
              <div className="cards-grid-container">
                {campaigns.map(campaign => (
                  <CampaignCard key={campaign.clientId} campaign={campaign} />
                ))}
              </div>
            </div>
          )}
          {!hasError && isLoading && <Loader />}

          {// There are no Campaigns, show empty state
          !hasError && !isLoading && campaigns.length === 0 && (
            <div>
              <center>
                <p>&iexcl;A&uacute;n no hay campa&ntilde;as!</p>
                <img
                  className="empty-state-img"
                  src={`${process.env.PUBLIC_URL}/img/campaign.svg`}
                  width="200px"
                  height="200px"
                  alt="no-campaigns-icon"
                />
              </center>
            </div>
          )}
          {hasError && (
            <p>
              <strong>Ups, algo fall&oacute;...</strong> La dapp no pudo cargar las Campa&ntilde;as
              por alguna raz&oacute;n. Intenta recargar la p&aacute;gina...
            </p>
          )}
        </div>
      </div>
    )
  }
}

Campaigns.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: selectCampaigns(state)
  }
}

export default connect(mapStateToProps)(
  withTranslation()(Campaigns)
)