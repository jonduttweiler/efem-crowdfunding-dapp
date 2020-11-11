import React from "react";
import {
  Text,
  Flex,
  Box,
  Link,
  Icon,
} from "rimble-ui";
import { withTranslation } from 'react-i18next';
import Web3App from '../Web3App'
import { connect } from 'react-redux'
import { selectCurrentUser } from '../../../redux/reducers/currentUserSlice'
import config from '../../../configuration'

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
    const { currentUser, transaction, t } = this.props;
    const { progress } = this.state;
    if (!transaction) {
      return null;
    }
    const progressText = `${progress}%`
    return (
      <Web3App.Consumer>
        {
          ({
            network
          }) =>
            <Flex flexDirection="column">
              <Box width={progressText} height="8px" bg="success" />
              <Box p={[2, 3]} color="near-white" width="100%" bg="dark-gray">
                <Flex
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Flex alignItems="center">
                    <Flex
                      mr={[2, 3]}
                      bg={"silver"}
                      borderRadius={"50%"}
                      height={"3em"}
                      width={"3em"}
                      minWidth={"3em"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Text>
                        {progressText}
                      </Text>
                    </Flex>
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">
                        {t(transaction.submittedTitleKey)}
                      </Text>
                      <Text fontSize={1}>
                        {t('transactionEstimatedTimeValue', {
                          transactionEstimatedTime: config.network.transactionEstimatedTime
                        })}
                      </Text>
                    </Flex>
                  </Flex>
                  <Link color="primary-lighter" ml={[2, 3]}>
                    <Flex alignItems="center">
                      Details
                      <Icon ml={1} name="Launch" size="16px" />
                    </Flex>
                  </Link>
                </Flex>
              </Box>
            </Flex>
        }
      </Web3App.Consumer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(TransactionProgressBanner)
);