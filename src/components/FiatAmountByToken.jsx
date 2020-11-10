import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import web3 from 'web3';
import BN from 'bn.js';

const RBTCAddress = '0x0000000000000000000000000000000000000000';

{/* recibe una cantidad de tokens y muestre el equivalente en fiat */ }
const FiatAmountByToken = ({ tokenAddress = RBTCAddress, tokenAmount }) => {
    const [fiatAmount, setFiatAmount] = useState();
    const { rate } = useSelector(state => state.exchangeRates.find(exr => exr.tokenAddress === tokenAddress))

    useEffect(() => {
        try {
            if (tokenAmount == "") {
                tokenAmount = 0;
            }
            const asWei = web3.utils.toWei(tokenAmount.toString());
            const tokenAmountWei = new BN(asWei);
            const rawFiatAmount = tokenAmountWei.div(new BN(rate));
            const fiatAmount = (rawFiatAmount.toNumber() / 100)//El rate representa 0.01 USD
            setFiatAmount(fiatAmount.toFixed(2))
            
        } catch (err) {
            console.log(err)
        }
    })

    return (
        <Typography variant="body1">
            {tokenAmount} [RBTC] = {fiatAmount} USD
        </Typography>
    )
}


export default FiatAmountByToken;