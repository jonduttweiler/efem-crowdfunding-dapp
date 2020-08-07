import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import BigNumber from 'bignumber.js';
import { Form, Input } from 'formsy-react-components';
import Slider from 'react-rangeslider';
import { Link } from 'react-router-dom';
import LoaderButton from './LoaderButton';
import config from '../configuration';
import { Consumer as Web3Consumer } from '../contextProviders/Web3Provider';
import SelectFormsy from './SelectFormsy';
import { Consumer as WhiteListConsumer } from '../contextProviders/WhiteListProvider';
import DAC from '../models/DAC';
import { connect } from 'react-redux'
import { addDonation } from '../redux/reducers/donationsSlice'
import { selectUser } from '../redux/reducers/userSlice'
import Donation from '../models/Donation';
import Web3Utils from '../utils/Web3Utils';
import CryptoAmount from './CryptoAmount';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-20%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 40px #ccc',
    overflowY: 'scroll',
  },
};

Modal.setAppElement('#root');

class DonateButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      formIsValid: false,
      amountText: '0',
      modalVisible: false,
      tokenWhitelistOptions: props.tokenWhitelist.map(t => ({
        value: t.address,
        title: t.name,
      })),
      selectedToken: config.nativeToken,
      donation: new Donation(),
      user: props.user
    };

    this.submit = this.submit.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  setToken(address) {
    const selectedToken = this.props.tokenWhitelist.find(t => t.address === address);
    selectedToken.balance = new BigNumber('0'); // FIXME: There should be a balance provider handling all of this...
    //this.setState({ selectedToken }, () => this.pollToken());
  }

  /**
   * Establece el número máximo de Ether a donar.
   */
  getMaxEtherAmountToDonate() {
    const { user } = this.state;
    return Web3Utils.weiToEther(user.balance);
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  closeDialog() {
    this.setState({
      modalVisible: false,
      amountText: '0',
      formIsValid: false,
    });
  }

  openDialog() {
    this.setState({
      modalVisible: true,
      amountText: '0',
      formIsValid: false,
    });
  }

  submit(model) {
    this.donate(model);
    this.setState({ isSaving: true });
  }

  /**
   * Realiza la donación del usuario.
   * 
   * En esta versión solamente se puede donar en el Token Nativo (RBTC).
   */
  donate(model) {

    const { donation, user, selectedToken } = this.state;
    const { entityId } = this.props.model;
    const amount = Web3Utils.etherToWei(model.amount);
    // Utilizado cuando se implemente la donación en otros tokens.
    const isDonationInToken = selectedToken.symbol !== config.nativeToken.symbol;
    const tokenAddress = isDonationInToken ? selectedToken.address : config.nativeToken.address;

    donation.entityId = entityId;
    donation.tokenAddress = tokenAddress;
    donation.amount = amount;
    donation.giverAddress = user.address;

    this.props.addDonation(this.state.donation);

    React.toast.info(<p>Gracias! Su donación está pendiente de confirmar</p>);

    this.closeDialog();
  }

  render() {
    const { model, validProvider, isCorrectNetwork } = this.props;
    const {
      amountText,
      formIsValid,
      isSaving,
      modalVisible,
      tokenWhitelistOptions,
      selectedToken,
      user
    } = this.state;

    const maxAmount = this.getMaxEtherAmountToDonate();

    const style = {
      display: 'inline-block',
    };

    const balance = user.balance;

    return (
      <span style={style}>
        <button type="button" className="btn btn-success" onClick={this.openDialog}>
          Donate
        </button>
        <Modal
          isOpen={modalVisible}
          onRequestClose={() => this.closeDialog()}
          shouldCloseOnOverlayClick={false}
          contentLabel={`Support this ${model.type}!`}
          style={modalStyles}
        >
          <Form
            onSubmit={this.submit}
            mapping={inputs => ({
              amount: inputs.amount,
              customAddress: inputs.customAddress,
            })}
            onValid={() => this.toggleFormValid(true)}
            onInvalid={() => this.toggleFormValid(false)}
            layout="vertical"
          >
            <h3>
              Donate to support <em>{model.title}</em>
            </h3>

            {!validProvider && (
              <div className="alert alert-warning">
                <i className="fa fa-exclamation-triangle" />
                Please install <a href="https://metamask.io/">MetaMask</a> to donate
              </div>
            )}
            {isCorrectNetwork && (
              <p>
                {model.type.toLowerCase() === DAC.type && (
                  <span>
                    You&apos;re pledging: as long as the Fund owner does not lock your money you can
                    take it back any time.
                  </span>
                )}
                {model.type.toLowerCase() !== DAC.type && (
                  <span>
                    You&apos;re committing your funds to this {model.type}, if you have filled out
                    contact information in your <Link to="/profile">Profile</Link> you will be
                    notified about how your funds are spent
                  </span>
                )}
              </p>
            )}

            {/*validProvider && !currentUser && (
              <div className="alert alert-warning">
                <i className="fa fa-exclamation-triangle" />
                It looks like your Provider is locked or you need to enable it.
              </div>
            )*/}

            {validProvider && isCorrectNetwork && (
              <div>
                {model.type !== 'milestone' && (
                  <SelectFormsy
                    name="token"
                    id="token-select"
                    label="Make your donation in"
                    helpText={`Select ${config.nativeToken.name} or the token you want to donate`}
                    value={selectedToken.address}
                    options={tokenWhitelistOptions}
                    onChange={address => this.setToken(address)}
                    disabled={model.type === 'milestone'}
                  />
                )}
                {/* TODO: remove this b/c the wallet provider will contain this info */}
                {config.homeNetworkName} {selectedToken.symbol} balance:&nbsp;
                <CryptoAmount amount={balance} />
              </div>
            )}

            <span className="label">How much {selectedToken.symbol} do you want to donate?</span>

            {validProvider && maxAmount.toNumber() > 0 && balance.gt(0) && (
              <div className="form-group">
                <Slider
                  type="range"
                  name="amount2"
                  min={0}
                  max={maxAmount.toNumber()}
                  step={maxAmount.toNumber() / 10}
                  value={Number(amountText)}
                  labels={{
                    0: <CryptoAmount amount={new BigNumber(0)}/>,
                    [maxAmount.toFixed()]: <CryptoAmount amount={balance}/>,
                  }}
                  tooltip={false}
                  onChange={newAmount => this.setState({ amountText: newAmount.toString() })}
                />
              </div>
            )}

            <div className="form-group">
              <Input
                name="amount"
                id="amount-input"
                type="number"
                value={amountText}
                onChange={(name, newAmount) => this.setState({ amountText: newAmount })}
                validations={{
                  lessOrEqualTo: maxAmount.toNumber(),
                  greaterThan: 0,
                }}
                validationErrors={{
                  greaterThan: `Please enter value greater than 0 ${selectedToken.symbol}`,
                  lessOrEqualTo: `This donation exceeds your wallet balance or the milestone max amount: ${maxAmount.toFixed()} ${
                    selectedToken.symbol
                    }.`,
                }}
                autoFocus
              />
            </div>
            <p>
              <small>
                By donating you agree to our{' '}
                <Link to="/termsandconditions">Terms and Conditions</Link> and{' '}
                <Link to="/privacypolicy">Privacy Policy</Link>.
              </small>
            </p>

            {validProvider && maxAmount.toNumber() !== 0 && balance !== '0' && (
              <LoaderButton
                className="btn btn-success"
                formNoValidate
                type="submit"
                disabled={isSaving || !formIsValid || !isCorrectNetwork}
                isLoading={isSaving}
                loadingText="Donating..."
              >
                Donate
              </LoaderButton>
            )}

            <button
              className="btn btn-light float-right"
              type="button"
              onClick={() => {
                this.setState({ modalVisible: false });
              }}
            >
              Close
            </button>
          </Form>
        </Modal>
      </span>
    );
  }
}

const modelTypes = PropTypes.shape({
  type: PropTypes.string.isRequired,
  //adminId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  entityId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.shape({}),
  maxDonation: PropTypes.instanceOf(BigNumber),
});

DonateButton.propTypes = {
  model: modelTypes.isRequired,
  validProvider: PropTypes.bool.isRequired,
  isCorrectNetwork: PropTypes.bool.isRequired,
  tokenWhitelist: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

DonateButton.defaultProps = {

};

const mapStateToProps = (state, ownProps) => {
  return {
    user: selectUser(state)
  }
}

const mapDispatchToProps = { addDonation }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(function DonBtn(props) {
  return (
    <WhiteListConsumer>
      {({ state: { tokenWhitelist } }) => (
        <Web3Consumer>
          {({ state: { isCorrectNetwork, validProvider, balance } }) => (
            <DonateButton
              validProvider={validProvider}
              isCorrectNetwork={isCorrectNetwork}
              tokenWhitelist={tokenWhitelist}
              {...props}
            />
          )}
        </Web3Consumer>
      )}
    </WhiteListConsumer>
  );
})