import getNetwork from '../getNetwork';
import exchangeRateUtils from "../../../redux/utils/exchangeRateUtils";
import ExchangeRate from 'models/ExchangeRate';
import BigNumber from 'bignumber.js';

const RBTCAddress = '0x0000000000000000000000000000000000000000';

window.ExchangeRate = ExchangeRate;
window.BigNumber = BigNumber;


/*
Para actualizar los exchange rates tenemos dos enfoques disponibles:
 o hacemos polling, o bien nos suscribimos a eventos
 Arrancamos con polling que es el mas sencillo porque no necesitamos escuchar por eventos ni modificar el smart contract
 Cuando tengamos mas tokens, escuchar los eventos va a ser lo mejor
 (No se si se pueden emitir eventos desde funciones tipo view ya que realizan modificaciones en la blockchain)
*/
async function initExchangeRateListener(){

    console.log("Listen for new Exchange rates")

    const pollingRateInterval = 60000;
    
    const { exchangeRateProvider } = await getNetwork();
    
    async function fetchExchangeRate() {
        const rate = await exchangeRateProvider.methods.getExchangeRate(RBTCAddress).call();
        /* console.log(`[${new Date().toISOString()}] RBTC/USD rate:${rate}`); */
        
        const exchangeRate = new ExchangeRate({
            tokenAddress:RBTCAddress,
            rate:new BigNumber(rate),
            date: Date.now()
        });

        exchangeRateUtils.updateExchangeRate(exchangeRate);
        
    }
    
    setInterval(fetchExchangeRate,pollingRateInterval);
}

export default initExchangeRateListener;
