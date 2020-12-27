import Web3Utils from 'lib/blockchain/Web3Utils';
import config from '../configuration';

/**
 * Clase utilitaria para el manejo de crypto.
 */
class CryptoUtils {

  /**
   * Formatea el monto crypto pasado como parámetro
   * 
   * @param token token
   * @param amount monto en wei a formatear.
   */
  static format(token, amount) {
    let tokenConfig = config.tokens[token];
    let amountEther = Web3Utils.weiToEther(amount).toFixed(tokenConfig.showDecimals);
    let symbol = tokenConfig.symbol;
    return amountEther + ' ' + symbol;
  }
}

export default CryptoUtils;
