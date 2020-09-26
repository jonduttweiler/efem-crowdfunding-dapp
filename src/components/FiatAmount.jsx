
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import FiatUtils from '../utils/FiatUtils';

/**
 * Presenta una cantidad de dinero Fiat.
 */
class FiatAmount extends Component {

    render() {
        let amountConfig = config.fiat;
        let amount = FiatUtils.centToDollar(this.props.amount).toFixed(amountConfig.showDecimals);
        let symbol = amountConfig.symbol;
        return (
            <span>{amount}{' '}{symbol}</span>
        );
    }
}

FiatAmount.propTypes = {
    /**
     * Cantidad de dinero Fiat en unidades de centavos.
     */
    amount: PropTypes.instanceOf(BigNumber).isRequired,
};

FiatAmount.defaultProps = {

};

export default FiatAmount;