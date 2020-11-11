import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectExchangeRateByToken } from '../redux/reducers/exchangeRatesSlice';
import FiatAmount from "./FiatAmount";
import BigNumber from 'bignumber.js';
import web3 from 'web3';
import config from '../configuration';

const RBTCAddress = '0x0000000000000000000000000000000000000000';

{/* recibe una cantidad de tokens y muestre el equivalente en fiat */ }
const FiatAmountByToken = ({ tokenAddress = RBTCAddress, tokenAmount }) => {
    const [fiatAmount, setFiatAmount] = useState();
    const { rate } = useSelector(state => selectExchangeRateByToken(state, tokenAddress)); 
    const {symbol} = config.tokens[tokenAddress];


    useEffect(() => {
        try {
            tokenAmount = (tokenAmount == "") ? 0 : tokenAmount;
            const asWei = web3.utils.toWei(tokenAmount.toString());
            const tokenAmountWei = new BigNumber(asWei);
            const centsFiatAmount = tokenAmountWei.dividedBy(rate);
            setFiatAmount(centsFiatAmount.toString());
        } catch (err) {
            console.log(err)
        }
    })

    return (
        <Typography variant="body1">
            {tokenAmount} [{symbol}] = <FiatAmount amount={new BigNumber(fiatAmount)}/>
        </Typography>
    )
}


export default FiatAmountByToken;