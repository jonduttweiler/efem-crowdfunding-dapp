import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Donation from '../models/Donation';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DateTimeViewer from './DateTimeViewer';
import Divider from '@material-ui/core/Divider';
import { withTranslation } from 'react-i18next';
import ProfileCard from './ProfileCard';
import CryptoAmount from './CryptoAmount';
import StatusIndicator from './StatusIndicator';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { selectDonation } from '../redux/reducers/donationsSlice'
import { connect } from 'react-redux'

class DonationItemTransfer extends Component {

  constructor() {
    super();
    this.state = {

    };

  }

  render() {
    const { donation, isChecked, classes, t } = this.props;
    const donationId = donation.id;
    const isTransferible = donation.isTransferible;
    const labelId = `transfer-list-all-item-${donationId}-label`;
    return (
      <ListItem role="listitem"
        button
        disabled={!isTransferible}
        onClick={() => this.props.handleToggle(donationId)}>
        <ListItemIcon>
          <Checkbox
            checked={isChecked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          className={classes.text}
          primary={<CryptoAmount amount={donation.amount} tokenAddress={donation.tokenAddress} />}
        />
      </ListItem>
    );
  }
}

DonationItemTransfer.propTypes = {
  donationId: PropTypes.number.isRequired
};

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    donation: selectDonation(state, ownProps.donationId)
  }
}

const mapDispatchToProps = { selectDonation }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationItemTransfer)
  )
);