import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import makeSelectDonationsBalance from '../redux/selectors/donationsBalanceSelector'
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js';
import TokenBalance from './TokenBalance';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import ExchangeRate from '../models/ExchangeRate';
import config from '../configuration';
import { selectExchangeRateByToken } from '../redux/reducers/exchangeRatesSlice'
import FiatAmount from './FiatAmount'
import { green } from '@material-ui/core/colors';

class DonationsBalance extends Component {

  constructor() {
    super();
  }

  render() {
    const { balance, exchangeRate, donationIds, classes, t } = this.props;
    const fiatAmount = balance.div(exchangeRate.rate);
    const donationsCount = donationIds.length;
    return (
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          title={
            <FiatAmount amount={fiatAmount}></FiatAmount>
          }
          subheader={t('donationsBalance')}>
        </CardHeader>
        <CardContent>

          <ListItem alignItems="flex-start" className={classes.donationsCount}>
            <ListItemAvatar>
              <Avatar className={classes.donationsCountAvatar}>
                <FavoriteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t('donations')}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {donationsCount}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>

          <TokenBalance balance={balance}></TokenBalance>
        </CardContent>
      </Card>
    );
  }
}

DonationsBalance.propTypes = {
  tokenAddress: PropTypes.string.isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
  exchangeRate: PropTypes.instanceOf(ExchangeRate).isRequired,
};

DonationsBalance.defaultProps = {
  tokenAddress: config.nativeToken.address
};

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  header: {
    paddingBottom: '0px'
  },
  donationsCount: {
    padding: '0px'
  },
  donationsCountAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    color: '#fff',
    backgroundColor: green[500],
  },
});

const makeMapStateToProps = () => {
  const selectDonationsBalance = makeSelectDonationsBalance()
  const mapStateToProps = (state, ownProps) => {
    let tokenAddress = ownProps.tokenAddress;
    if (!tokenAddress) {
      tokenAddress = config.nativeToken.address;
    }
    return {
      exchangeRate: selectExchangeRateByToken(state, tokenAddress),
      balance: selectDonationsBalance(state, ownProps.donationIds)
    };
  }
  return mapStateToProps
}

const mapDispatchToProps = {}

export default connect(makeMapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationsBalance)
  )
);