import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTruncatedText, history } from '../lib/helpers';
import CardStats from './CardStats';
import Campaign from '../models/Campaign';
import messageUtils from '../redux/utils/messageUtils'

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.js";
import { cardTitle } from "assets/jss/material-kit-react.js";
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

const styles = {
  ...imagesStyles,
  cardTitle,
};


/**
 * Campaign Card visible in the DACs view.
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 */
class CampaignCard extends Component {
  constructor(props) {
    super(props);
    this.viewCampaign = this.viewCampaign.bind(this);
  }

  viewCampaign() {
    if (this.props.campaign.isPending) {
      messageUtils.addMessageWarn({ text: 'La campaña no ha sido confirmada aún.' });
    } else {
      history.push(`/campaigns/${this.props.campaign.id}`);
    }
  }

  render() {
    const { classes, t, campaign } = this.props;

    return (
      <Card
        id={campaign.id} // eslint-disable-line no-underscore-dangle
        onClick={this.viewCampaign}
        onKeyPress={this.viewCampaign}
        role="button"
        tabIndex="0"
      >
      
        <div className={classes.cardImg} style={{ backgroundImage: `url(${campaign.imageCidUrl})` }} />

        <CardBody>
          <h4 className={classes.cardTitle}>{getTruncatedText(campaign.title, 40)}</h4>
          <p>{getTruncatedText(campaign.description,100)}</p>
        </CardBody>

        <div className="card-footer">
            <CardStats
              type="campaign"
              status={campaign.status}
              donations={campaign.budgetDonationsCount}
            />
        </div>

      </Card>
    );
  }
}

CampaignCard.propTypes = {
  campaign: PropTypes.instanceOf(Campaign).isRequired,
};

CampaignCard.defaultProps = {};

export default withTranslation()(withStyles(styles)(CampaignCard));