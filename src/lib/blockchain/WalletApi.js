import getWeb3 from './getWeb3';
import BigNumber from 'bignumber.js';

/**
 * API encargada de la interacción con la Wallet del usuario.
 */
class WalletApi {

    constructor() { }


    /**
     * Obtiene la dirección de la cuenta del usuario utilizada en la Wallet.
     */
    async getAccountAddress() {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                return accounts[0];
            }
        } catch (e) {
            console.log('Error obteniendo cuentas desde la wallet.', e);
        }
        return undefined;
    }

    /**
     * Obtiene el balance de del accountAddress.
     */
    async getBalance(accountAddress) {
        try {
            const web3 = await getWeb3();
            const balance = await web3.eth.getBalance(accountAddress);
            return new BigNumber(balance);
        } catch (e) {
            console.log('Error obteniendo el balance de la cuenta.', e);
        }
        return undefined;
    }
}

export default new WalletApi();