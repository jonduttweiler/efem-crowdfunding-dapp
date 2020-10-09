import Web3 from 'web3';
import Portis from '@portis/web3';
import config from '../../configuration';

let newWeb3;

let enablePromise;
function enable(force = false) {
  if (!force && enablePromise) return enablePromise;

  return new Promise((resolve, reject) =>
    this.currentProvider.enable() //esta es la linea que hace abrir el metamask
      .then(addrs => {
        this.isEnabled = true;
        resolve(addrs);
      })
      .catch(e => {
        enablePromise = false;
        this.isEnabled = false;
        reject(e);
      }),
  );

}

export default () =>
  new Promise(resolve => {
    if (document.readyState !== 'complete') {
      // wait until complete
    }
    if (!newWeb3) {
      if (window.ethereum) {
        newWeb3 = new Web3(window.ethereum);
        newWeb3.enable = enable.bind(newWeb3);
      } else if (window.web3) {
        newWeb3 = new Web3(window.web3.currentProvider);
        newWeb3.enable = newWeb3.eth.getAccounts;
        newWeb3.accountsEnabled = true;
      } else {
        const myPrivateEthereumNode = {
          nodeUrl: config.nodeConnection,
          chainId: config.nodeId,
          nodeProtocol: 'rpc',
        };
        const portis = new Portis('912ffb93-0aa8-4c63-b68f-9328fc9cfea7', myPrivateEthereumNode);
        newWeb3 = new Web3(portis.provider);
      }
    }

    //newWeb3.eth.handleRevert = true;

    resolve(newWeb3);
  });
