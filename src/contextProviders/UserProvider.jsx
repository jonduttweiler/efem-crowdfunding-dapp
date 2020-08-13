import React, { Component, createContext } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { utils } from 'web3';
import { authenticateIfPossible } from 'lib/middleware';
import { feathersClient } from '../lib/feathersClient';
import web3 from 'web3';
import ErrorPopup from '../components/ErrorPopup';

// models
import User from '../models/User';
import { connect } from 'react-redux'
import { loadUser } from '../redux/reducers/userSlice';

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };


// TO DO: This is the minimum transaction view required to:
// create a DAC / Campaign / Milestone / Profile
React.minimumWalletBalance = 0.000005;
React.minimumWalletBalanceInWei = new BigNumber(
  utils.toWei(new BigNumber(React.minimumWalletBalance).toString()),
);


function areDistinctAccounts(account1,account2){
  const keccakAccount1 = account1 && web3.utils.keccak256(account1);
  const keccakAccount2 = account2 && web3.utils.keccak256(account2);
  return keccakAccount1 !== keccakAccount2;
}


/**
 * This container holds the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 */
class UserProvider extends Component {
  constructor() {
    super();

    this.state = {
      currentUser: undefined,
      hasError: false,
    };

    this.getUserData = this.getUserData.bind(this);
    this.authenticateFeathers = this.authenticateFeathers.bind(this);
    this.signIn = this.signIn.bind(this);

    // hack to make signIn globally available
    React.signIn = this.signIn;
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.state;
    const { account: currentAccount } = this.props;
    const { account: prevAccount } = prevProps;

    if (areDistinctAccounts(currentAccount,prevAccount)) {
      console.log("Load user with account:", currentAccount);
      this.props.loadUser();
    }

    if ((currentAccount && !currentUser) || (currentUser && currentAccount !== prevAccount)) {
      this.getUserData(currentAccount);
    }
  }

  componentWillUnmount() {
    if (this.userSubscriber) this.userSubscriber.unsubscribe();
  }

  async getUserData(address) { //TODO: replazar esto por una llamada al user service
    if (this.userSubscriber) this.userSubscriber.unsubscribe();

    return new Promise((resolve, reject) => {
      if (!address) {
        this.setState({ currentUser: undefined }, () => {
          resolve();
          this.props.onLoaded();
        });
      } else {
        this.userSubscriber = feathersClient
          .service('/users')
          .watch({ listStrategy: 'always' })
          .find({
            query: {
              address,
            },
          })
          .subscribe(
            resp => {
              const currentUser = resp.total === 1 ? new User(resp.data[0]) : new User({ address });
              this.setState({ currentUser }, () => {
                this.authenticateFeathers();
                resolve();
              });
            },
            error => {
              ErrorPopup(
                'Something went wrong with getting user profile. Please try again after refresh.',
                error,
              );
              this.setState({ currentUser: new User({ address }) }, () => {
                this.authenticateFeathers();
                reject();
              });
            },
          );
      }
    });
  }

  signIn(redirectOnFail = true) {
    const { currentUser } = this.state;

    if (currentUser) {
      authenticateIfPossible(currentUser, redirectOnFail).then(isAuthenticated => {
        if (isAuthenticated) {
          currentUser.authenticated = true;
          this.setState({ currentUser: new User(currentUser) });
          this.props.onLoaded();
        }
      });
    }
  }

  async authenticateFeathers() {
    const { currentUser } = this.state;

    if (currentUser) {
      try {
        const token = await feathersClient.passport.getJWT();

        if (token) {
          const payload = await feathersClient.passport.verifyJWT(token);

          if (currentUser.address === payload.userId) {
            await feathersClient.authenticate(); // authenticate the socket connection
            currentUser.authenticated = true;
            this.setState({ currentUser });
          } else {
            await feathersClient.logout();
          }
        } else {
          currentUser.authenticated = false;
          this.setState({ currentUser });
        }
      } catch (e) {
        // ignore
      }
    }

    this.props.onLoaded();
  }

  render() {
    const { currentUser, hasError } = this.state;

    return (
      <Provider
        value={{
          state: {
            currentUser,
            hasError,
            signIn: this.signIn,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  account: PropTypes.string,
  onLoaded: PropTypes.func,
};

UserProvider.defaultProps = {
  onLoaded: () => {},
  account: undefined,
};

const mapStateToProps = (state, ownProps) => {
  return {
    
  }
}

const mapDispatchToProps = { loadUser }

export default connect(mapStateToProps, mapDispatchToProps)(UserProvider)
