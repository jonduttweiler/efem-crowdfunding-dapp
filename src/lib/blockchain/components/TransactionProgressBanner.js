import React from "react";
import Link from '@material-ui/core/Link';
import { withTranslation } from 'react-i18next';
import Web3App from '../Web3App'
import { connect } from 'react-redux'
import config from '../../../configuration'
import CircularProgressWithLabel from '../../../components/CircularProgressWithLabel'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Flash } from 'rimble-ui';
/**
 * https://reactjs.org/docs/state-and-lifecycle.html
 */
class TransactionProgressBanner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      progress: 0
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.calculeProgress(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  calculeProgress() {
    const { transaction } = this.props;
    if (transaction && transaction.submittedTime) {
      let timeDiff = Date.now() - transaction.submittedTime;
      let progress = 0;
      if (timeDiff < config.network.transactionEstimatedTimeMilliseconds) {
        progress = (timeDiff / config.network.transactionEstimatedTimeMilliseconds) * 100;
      } else {
        progress = 100;
      }
      this.setState({
        progress: progress.toFixed()
      });
    }
  }



  render() {
    const { transaction, t } = this.props;
    const { progress } = this.state;
    if (!transaction) {
      return null;
    }
    const preventDefault = (event) => event.preventDefault();
    return (
      <Web3App.Consumer>
        {
          ({
            network
          }) =>
            <Flash variant="info">
              <Grid container
                spacing={2}
                alignItems="center">
                <Grid item xs={1}>
                  <CircularProgressWithLabel value={progress} />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">
                    {t(transaction.pendingTitle.key, transaction.pendingTitle.args)}
                  </Typography>
                  <Typography variant="body2">
                    {t('transactionEstimatedTimeValue', {
                      transactionEstimatedTime: config.network.transactionEstimatedTime
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Link href={config.network.explorer + 'tx/' + transaction.hash} onClick={preventDefault}>
                    {t('transactionExplore')}
                  </Link>
                </Grid>
              </Grid>
            </Flash>

        }
      </Web3App.Consumer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = {}

const styles = theme => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(TransactionProgressBanner)
  )
);