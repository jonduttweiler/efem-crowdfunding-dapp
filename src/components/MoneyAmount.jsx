
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import Web3Utils from '../utils/Web3Utils';

/**
 * Presenta una cantidad de dinero especificando la moneda.
 */
class MoneyAmount extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let model = {
            amount: '',
            symbol: ''
        }
        if(this.props.tokenAddress) {
            // Los token se mantienen en unidad Wei
            let amountConfig = config.tokens[this.props.tokenAddress];
            model.amount = Web3Utils.weiToEther(this.props.amount).toFixed(amountConfig.showDecimals);
            model.symbol = amountConfig.symbol;
        } else {
            // El dinero fiat se mantiene en unidad de centavos.
            let amountConfig = config.fiat;
            model.amount = (this.props.amount.multipliedBy(100)).toFixed(amountConfig.showDecimals);
            model.symbol = amountConfig.symbol;
        }
        return (
            <spam>
                {model.amount}{' '}{model.symbol}
            </spam>
        );
    }
}

MoneyAmount.propTypes = {
    amount: PropTypes.instanceOf(BigNumber).isRequired,
};

MoneyAmount.defaultProps = {

};

export default MoneyAmount;