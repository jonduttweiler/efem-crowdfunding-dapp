import { Observable } from 'rxjs'
import { ALL_ROLES } from '../../constants/Role';
import getWeb3 from './getWeb3';

/**
 * API encargada de la interacción con la Wallet del usuario.
 */
class WalletApi {

    constructor() { }


    /**
     * Obtiene la cuenta del usuario utilizada en la Wallet.
     */
    getAccount() {
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
}

export default WalletApi;