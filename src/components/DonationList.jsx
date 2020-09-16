import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Donation from '../models/Donation';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import DonationItem from './DonationItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';

class DonationList extends Component {

  render() {
    const { donations, classes, t } = this.props;
    return (
      <Container fixed>
        <Typography variant="overline">
          {t('donations')}
        </Typography>
        <List className={classes.root}>
          {donations.map(donation => (
            <DonationItem key={donation.clientId} donation={donation}></DonationItem>
          ))}
        </List>
        {donations.length == 0 && (
          <Typography variant="body2">
            {t('donationsEmpty')}
          </Typography>
        )}
      </Container>
    );
  }
}

DonationList.propTypes = {
  donations: PropTypes.arrayOf(PropTypes.instanceOf(Donation)).isRequired
};

const styles = {
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline',
  }
};

export default withStyles(styles)(
  withTranslation()(DonationList)
);
