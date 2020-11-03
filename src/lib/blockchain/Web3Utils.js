import BigNumber from 'bignumber.js';
import { utils } from 'web3';
import config from '../../configuration';

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

  static addressEquals(address1, address2) {
    return toChecksumAddress(address1) === toChecksumAddress(address2);
  }
}

/**
   * Checksum Address Encoding
   * 
   * https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
   * 
   */
function toChecksumAddress(address) {
  const chainId = config.network.requiredId;
  const strip_address = stripHexPrefix(address).toLowerCase()
  const prefix = chainId != null ? (chainId.toString() + '0x') : ''
  const keccak_hash = utils.keccak256(prefix + strip_address).toString('hex')
  let output = '0x'
  for (let i = 0; i < strip_address.length; i++) {
    output += parseInt(keccak_hash[i], 16) >= 8 ?
      strip_address[i].toUpperCase() :
      strip_address[i]
  }
  return output
}

function stripHexPrefix(address) {
  if (address != undefined && address.startsWith('0x')) {
    return address.slice(2);
  }
  return address;
}

export default Web3Utils;
