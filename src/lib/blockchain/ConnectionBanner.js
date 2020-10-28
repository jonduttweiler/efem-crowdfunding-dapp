import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RimbleUtils from './NetworkUtils';
import { Box, Flex, Icon, Text, MetaMaskButton, Flash } from 'rimble-ui';
import { useTranslation } from 'react-i18next';

const WrongNetwork = ({
  currentNetwork,
  requiredNetwork,
  onWrongNetworkMessage,
}) => {
  const { t } = useTranslation();
  const requiredNetworkName = RimbleUtils.getEthNetworkNameById(requiredNetwork);
  const currentNetworkName = RimbleUtils.getEthNetworkNameById(currentNetwork);
  return (
    <div>
      {onWrongNetworkMessage === null ? (
        // Show default banner
        <Flash variant={'danger'}>
          <Flex alignItems="center">
            <Box pr={3}>
              <Icon name="Warning" size="44" />
            </Box>
            <Flex flexDirection="column">
              <Text fontWeight="bold" color={'inherit'}>
                {t('web3WrongNetworkTitle', {
                  requiredNetwork: requiredNetworkName
                })}
              </Text>
              <Text color={'inherit'}>
                {t('web3WrongNetworkDescription', {
                  requiredNetwork: requiredNetworkName,
                  currentNetwork: currentNetworkName
                })}
              </Text>
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
                <Icon name="Warning" size="44" />
              </Box>
              <Flex flexDirection="column">
                <Text  color={'inherit'}>
                  {t('web3NoNetwork')}
                </Text>
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
              <Icon name="Warning" size="44" />
            </Box>
            <Flex flexDirection="column">
              <Text fontWeight="bold" color={'inherit'}>
                {t('web3NotWeb3BrowserTitle')}
              </Text>
              {RimbleUtils.isMobileDevice() ? (
                <Text color={'inherit'}>
                  {t('web3NotWeb3BrowserDescriptionMobile')}
                </Text>
              ) : (
                <Text color={'inherit'}>
                  {t('web3NotWeb3BrowserDescription')}
                </Text>
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

class ConnectionBanner extends Component {
  static propTypes = {
    currentNetwork: PropTypes.number,
    requiredNetwork: PropTypes.number,
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
    onWeb3Fallback: false,
    children: {
      notWeb3CapableBrowserMessage: null,
      noNetworkAvailableMessage: null,
      onWrongNetworkMessage: null,
    },
  };

  state = {
    isCorrectNetwork: null,
  };

  checkCorrectNetwork = () => {
    const isCorrectNetwork =
      this.props.currentNetwork === this.props.requiredNetwork;
    if (isCorrectNetwork !== this.state.isCorrectNetwork) {
      this.setState({ isCorrectNetwork });
    }
  };

  componentDidMount() {
    const browserIsWeb3Capable = RimbleUtils.browserIsWeb3Capable();
    //const browserIsWeb3Capable = false;
    this.setState({ browserIsWeb3Capable });
  }

  componentDidUpdate() {
    if (this.props.currentNetwork && this.props.requiredNetwork) {
      this.checkCorrectNetwork();
    }
  }

  render() {
    const { currentNetwork, requiredNetwork, onWeb3Fallback } = this.props;
    const {
      notWeb3CapableBrowserMessage,
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    return (
      <div>
        {this.state.browserIsWeb3Capable === false ? (
          <NotWeb3Browser
            notWeb3CapableBrowserMessage={notWeb3CapableBrowserMessage}
          />
        ) : onWeb3Fallback === true || currentNetwork === null ? (
          <NoNetwork noNetworkAvailableMessage={noNetworkAvailableMessage} />
        ) : this.state.isCorrectNetwork === false ? (
          <WrongNetwork
            currentNetwork={currentNetwork}
            requiredNetwork={requiredNetwork}
            onWrongNetworkMessage={onWrongNetworkMessage}
          />
        ) : null}
      </div>
    );
  }
}

export default ConnectionBanner;