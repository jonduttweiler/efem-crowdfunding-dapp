import BigNumber from 'bignumber.js';
import { utils } from 'web3';

class Web3Utils {
  
  /**
   * Convierte los Wei pasados como parámetro en una cantidad de Ether.
   *
   * @param weiAmount cantidad de wei a converir a en Ether.
   * @returns equivalente en Ether de los Wei pasado como parámetro.
   */
  static weiToEther(weiAmount) {
    return new BigNumber(utils.fromWei(weiAmount.toFixed()));
  }

  /**
   * Convierte los Ether pasados como parámetro en una cantidad de Wei.
   *
   * @param etherAmount cantidad de Ether a converir a en Wei.
   * @returns equivalente en Wei de los Ether pasado como parámetro.
   */
  static etherToWei(etherAmount) {
    return new BigNumber(utils.toWei(etherAmount));
  }
}

export default Web3Utils;
