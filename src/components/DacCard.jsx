import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTruncatedText, history } from '../lib/helpers';
import CardStats from './CardStats';
import DAC from '../models/DAC';
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
 * DAC Card visible in the DACs view.
 *
 * @param currentUser  Currently logged in user information
 */
class DacCard extends Component {
  constructor(props) {
    super(props);

    this.viewDAC = this.viewDAC.bind(this);
  }

  viewDAC() {
    if (this.props.dac.isPending) {
      messageUtils.addMessageWarn({ text: 'La DAC no ha sido confirmada aún.' });
    } else {
      history.push(`/dacs/${this.props.dac.id}`);
    }
  }

  render() {
    const { classes, t, dac } = this.props;

    return (
      <Card
        id={dac.id}
        onClick={this.viewDAC}
        onKeyPress={this.viewDAC}
        role="button"
        tabIndex="0"
      >

        <div className={classes.cardImg} style={{ backgroundImage: `url(${dac.imageCidUrl})` }} />

        <CardBody>
          <h4 className={classes.cardTitle}>{getTruncatedText(dac.title, 40)}</h4>
          <p>{getTruncatedText(dac.description,100)}</p>
        </CardBody>

        <div className="card-footer">
            <CardStats
              type="dac"
              status={dac.status}
              donations={dac.budgetDonationsCount}
            />
        </div>
      </Card>
    );
  }
}

DacCard.propTypes = {
  dac: PropTypes.instanceOf(DAC).isRequired,
};

DacCard.defaultProps = {};

export default withTranslation()(withStyles(styles)(DacCard));
