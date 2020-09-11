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
    let value = etherAmount;
    if (!(etherAmount instanceof String)) {
      value = etherAmount.toString();
    }
    return new BigNumber(utils.toWei(value));
  }


  static areDistinctAccounts(account1, account2) {
    const keccakAccount1 = account1 && utils.keccak256(account1);
    const keccakAccount2 = account2 && utils.keccak256(account2);
    return keccakAccount1 !== keccakAccount2;
  }

}

export default Web3Utils;
