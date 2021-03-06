
import { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import CryptoUtils from 'utils/CryptoUtils';

/**
 * Presenta una cantidad de dinero crypto.
 * 
 */
class CryptoAmount extends Component {

    render() {
        return CryptoUtils.format(this.props.tokenAddress, this.props.amount)
    }
}

CryptoAmount.propTypes = {
    /**
     * Cantidad de crypto medida en Wei
     */
    amount: PropTypes.instanceOf(BigNumber).isRequired,
    tokenAddress: PropTypes.string.isRequired,
};

CryptoAmount.defaultProps = {
    tokenAddress: config.nativeToken.address
};

export default CryptoAmount;