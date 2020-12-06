import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import makeSelectDonationsBalance from '../redux/selectors/donationsBalanceSelector'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import { green } from '@material-ui/core/colors'
import FiatTargetProgress from './FiatTargetProgress'
import { fetchDonationsByIds } from '../redux/reducers/donationsSlice'

class DonationsBalanceMini extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.fetchDonationsByIds(this.props.donationIds);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (JSON.stringify(this.props.donationIds) !== JSON.stringify(prevProps.donationIds)) {
      this.props.fetchDonationsByIds(this.props.donationIds);
    }
  }

  render() {
    const { balances, fiatTarget, classes, t } = this.props;

    return (
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          subheader={t('donationsBalance')}>
        </CardHeader>
        <CardContent className={classes.content}>          
          {fiatTarget && (
            <FiatTargetProgress
              fiatBalance={balances.fiatTotalBalance}
              fiatTarget={fiatTarget}>
            </FiatTargetProgress>
          )}
        </CardContent>
      </Card>
    );
  }
}

DonationsBalanceMini.propTypes = {

};

DonationsBalanceMini.defaultProps = {

};

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  header: {
    paddingBottom: '0px'
  },
  content: {
    paddingTop: '0px'
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
    return {
      balances: selectDonationsBalance(state, ownProps.donationIds)
    };
  }
  return mapStateToProps
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(makeMapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationsBalanceMini)
  )
);