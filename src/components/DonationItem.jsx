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

class DonationItem extends Component {

  constructor() {
    super();
    this.state = {
      activities: {},
      isLoading: false,
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let open = !this.state.open;
    this.setState({
      open: open
    });
  };

  render() {
    const { user, open } = this.state;
    const { donation, classes, t } = this.props;
    return (
      <React.Fragment>
        <ListItem alignItems="flex-start" onClick={this.handleClick}>
          <ListItemAvatar>
            <ProfileCard address={donation.giverAddress} namePosition="bottom"/>
          </ListItemAvatar>
          <ListItemText
            className={classes.text}
            primary={<CryptoAmount amount={donation.amount} tokenAddress={donation.tokenAddress}/>}
            secondary={
              <React.Fragment>
                <StatusIndicator status={donation.status}></StatusIndicator>
                <DateTimeViewer value={donation.createdAt}/>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  }
}

DonationItem.propTypes = {
  donation: PropTypes.instanceOf(Donation).isRequired
};

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  text: {
    marginLeft: '2em'
  }
});

export default withStyles(styles)(
  withTranslation()(DonationItem)
);
