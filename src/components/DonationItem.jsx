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
import { connect } from 'react-redux'
import { selectDonation } from '../redux/reducers/donationsSlice'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import makeEntitySelect from '../redux/selectors/entitiesSelector';
import Avatar from '@material-ui/core/Avatar';

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
    const { donation, entity, classes, t } = this.props;

    if (!donation) {
      // TODO Implementar un Skeletor (https://material-ui.com/components/skeleton/) cuando no esté en Labs.
      return (<div></div>)
    }

    return (
      <React.Fragment>
        <ListItem alignItems="flex-start" onClick={this.handleClick}>
          <ListItemAvatar>
            <ProfileCard address={donation.giverAddress} namePosition="bottom" />
          </ListItemAvatar>
          <ListItemText
            className={classes.text}
    
            secondary={
              <React.Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <Typography variant="h6">
                      <CryptoAmount amount={donation.amountRemainding} tokenAddress={donation.tokenAddress} />
                    </Typography>
                    <StatusIndicator status={donation.status}></StatusIndicator>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h6" gutterBottom>
                      {t('donationInitial')}
                    </Typography>
                    <ListItem alignItems="flex-start" className={classes.root}>
                      <ListItemAvatar>
                        <Avatar variant="rounded" src={entity.imageCidUrl} className={classes.entityLogo} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={entity.title}
                        secondary={
                          <React.Fragment>
                            <CryptoAmount amount={donation.amount} tokenAddress={donation.tokenAddress} />
                            <DateTimeViewer value={donation.createdAt} />
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  }
}


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
  },
  entityLogo: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  }
});

DonationItem.propTypes = {
  donationId: PropTypes.number.isRequired
};

const makeMapStateToProps = () => {
  const entitySelect = makeEntitySelect()
  const mapStateToProps = (state, ownProps) => {
    let props = {}
    props.donation = selectDonation(state, ownProps.donationId);
    if (props.donation) {
      props.entity = entitySelect(state, props.donation.entityId);
    }
    return props;
  }
  return mapStateToProps
}

const mapDispatchToProps = {}

export default connect(makeMapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationItem)
  )
);