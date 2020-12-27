import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetworkUtils from './NetworkUtils';
import { Icon, MetaMaskButton, Flash } from 'rimble-ui';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { selectLastCreated, selectFirstPending, deleteTransaction } from '../../redux/reducers/transactionsSlice';
import TransactionProgressBanner from './components/TransactionProgressBanner';
import Grid from '@material-ui/core/Grid';

const WrongNetwork = ({
  currentNetwork,
  requiredNetwork,
  onWrongNetworkMessage,
}) => {
  const { t } = useTranslation();
  const requiredNetworkName = NetworkUtils.getEthNetworkNameById(requiredNetwork);
  const currentNetworkName = NetworkUtils.getEthNetworkNameById(currentNetwork);
  return (
    <div>
      {onWrongNetworkMessage === null ? (
        // Show default banner
        <Flash variant={'danger'}>
          <Grid container
            spacing={2}
            alignItems="center">
            <Grid item xs={1}>
              <Icon name="Warning" size="30" />
            </Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle2">
                {t('web3WrongNetworkTitle', {
                  requiredNetwork: requiredNetworkName
                })}
              </Typography>
              <Typography variant="body2">
                {t('web3WrongNetworkDescription', {
                  requiredNetwork: requiredNetworkName,
                  currentNetwork: currentNetworkName
                })}
              </Typography>
            </Grid>
          </Grid>
        </Flash>
      ) : (
          // Show custom banner
          onWrongNetworkMessage
        )}
    </div>
  );
};

const NoNetwork = ({ noNetworkAvailableMessage }) => {
  const { t } = useTranslation();
  return (
    <div>
      {noNetworkAvailableMessage === null ? (
        <Flash variant={'danger'}>
          <Grid container
            spacing={2}
            alignItems="center">
            <Grid item xs={1}>
              <Icon name="Warning" size="30" />
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body2">
                {t('web3NoNetwork')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <MetaMaskButton
                as="a"
                href="https://metamask.io/"
                target="_blank"
                color={'white'}
                size="small"
              >
                {t('web3InstallMetaMask')}
              </MetaMaskButton>
            </Grid>
          </Grid>
        </Flash>
      ) : (
          noNetworkAvailableMessage
        )}
    </div>
  );
};

const NotWeb3Browser = ({ notWeb3CapableBrowserMessage }) => {
  const { t } = useTranslation();
  return (
    <div>
      {notWeb3CapableBrowserMessage === null ? (
        <Flash variant={'danger'}>
          <Grid container
            spacing={2}
            alignItems="center">
            <Grid item xs={1}>
              <Icon name="Warning" size="30" />
            </Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle2">
                {t('web3NotWeb3BrowserTitle')}
              </Typography>
              {NetworkUtils.isMobileDevice() ? (
                <Typography variant="body2">
                  {t('web3NotWeb3BrowserDescriptionMobile')}
                </Typography>
              ) : (
                  <Typography variant="body2">
                    {t('web3NotWeb3BrowserDescription')}
                  </Typography>
                )}
            </Grid>
          </Grid>
        </Flash>
      ) : (
          notWeb3CapableBrowserMessage
        )}
    </div>
  );
};

class Web3Banner extends Component {
  static propTypes = {
    currentNetwork: PropTypes.number,
    requiredNetwork: PropTypes.number,
    isCorrectNetwork: PropTypes.bool,
    onWeb3Fallback: PropTypes.bool,
    children: PropTypes.shape({
      notWeb3CapableBrowserMessage: PropTypes.node,
      noNetworkAvailableMessage: PropTypes.node,
      onWrongNetworkMessage: PropTypes.node,
    }),
  };
  static defaultProps = {
    currentNetwork: null,
    requiredNetwork: null,
    isCorrectNetwork: true,
    onWeb3Fallback: false,
    children: {
      notWeb3CapableBrowserMessage: null,
      noNetworkAvailableMessage: null,
      onWrongNetworkMessage: null,
    },
  };

  state = {

  };

  componentDidMount() {
    const browserIsWeb3Capable = NetworkUtils.browserIsWeb3Capable();
    this.setState({ browserIsWeb3Capable });
  }

  componentDidUpdate() {
    if (this.props.currentNetwork && this.props.requiredNetwork) {
    
    }
  }

  render() {
    const { currentNetwork,
      requiredNetwork,
      onWeb3Fallback,
      transactionFirstPending } = this.props;
    const {
      notWeb3CapableBrowserMessage,
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    return (

      <div style={{
        marginRight: '1em',
        width: '60%'
      }}>
        {this.state.browserIsWeb3Capable === false ? (
          <NotWeb3Browser
            notWeb3CapableBrowserMessage={notWeb3CapableBrowserMessage}
          />
        ) : onWeb3Fallback === true || currentNetwork === null ? (
          <NoNetwork noNetworkAvailableMessage={noNetworkAvailableMessage} />
        ) : this.props.isCorrectNetwork === false ? (
          <WrongNetwork
            currentNetwork={currentNetwork}
            requiredNetwork={requiredNetwork}
            onWrongNetworkMessage={onWrongNetworkMessage}
          />
        ) : null}

        <TransactionProgressBanner
          transaction={transactionFirstPending}>
        </TransactionProgressBanner>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    transactionCreated: selectLastCreated(state),
    transactionFirstPending: selectFirstPending(state)
  }
}

const mapDispatchToProps = { deleteTransaction }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(Web3Banner)
)