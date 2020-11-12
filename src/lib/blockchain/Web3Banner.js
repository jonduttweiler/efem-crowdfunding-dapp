import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetworkUtils from './NetworkUtils';
import { Box, Flex, Icon, Text, MetaMaskButton, Flash } from 'rimble-ui';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { selectLastCreated, selectPendings, deleteTransaction } from '../../redux/reducers/transactionsSlice';
import TransactionProgressBanner from './components/TransactionProgressBanner';

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
          <Flex alignItems="center">
            <Box pr={3}>
              <Icon name="Warning" size="30" />
            </Box>
            <Flex flexDirection="column">
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
            </Flex>
          </Flex>
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
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" pr={'2'}>
              <Box pr={3}>
                <Icon name="Warning" size="30" />
              </Box>
              <Flex flexDirection="column">
                <Typography variant="body2">
                  {t('web3NoNetwork')}
                </Typography>
              </Flex>
            </Flex>

            <MetaMaskButton
              as="a"
              href="https://metamask.io/"
              target="_blank"
              color={'white'}
              size="small"
            >
              {t('web3InstallMetaMask')}
            </MetaMaskButton>
          </Flex>
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
          <Flex alignItems="center">
            <Box pr={3}>
              <Icon name="Warning" size="30" />
            </Box>
            <Flex flexDirection="column">
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
            </Flex>
          </Flex>
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
    //isCorrectNetwork: null,
  };

  /*checkCorrectNetwork = () => {
    const isCorrectNetwork =
      this.props.currentNetwork === this.props.requiredNetwork;
    if (isCorrectNetwork !== this.state.isCorrectNetwork) {
      this.setState({ isCorrectNetwork });
    }
  };*/

  componentDidMount() {
    const browserIsWeb3Capable = NetworkUtils.browserIsWeb3Capable();
    //const browserIsWeb3Capable = false;
    this.setState({ browserIsWeb3Capable });
  }

  componentDidUpdate() {
    if (this.props.currentNetwork && this.props.requiredNetwork) {
      //this.checkCorrectNetwork();
    }
  }

  render() {
    const { currentNetwork,
      requiredNetwork,
      onWeb3Fallback,
      transactionCreated,
      transactionsPendings } = this.props;
    const {
      notWeb3CapableBrowserMessage,
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    return (

      <div style={{
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

        {transactionsPendings.map(transaction => (
          <TransactionProgressBanner
            key={transaction.cliendId}
            transaction={transaction}>
          </TransactionProgressBanner>
        ))}

      </div>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    transactionCreated: selectLastCreated(state),
    transactionsPendings: selectPendings(state)
  }
}

const mapDispatchToProps = { deleteTransaction }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(Web3Banner)
)