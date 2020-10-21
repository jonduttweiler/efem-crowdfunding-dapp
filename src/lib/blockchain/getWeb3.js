import Web3 from 'web3';
import Web3HttpProvider from 'web3-providers-http';
import config from '../../configuration';

let web3;

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
    if (!web3) {
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        web3.enable = enable.bind(web3);
        console.log('Configuración Web3: Browser Ethereum Provider.');
      } else {
        var web3HttpProvider = new Web3HttpProvider(config.nodeConnection, {
          keepAlive: true,
          timeout: 20000, // milliseconds
        });
        web3 = new Web3(web3HttpProvider);
        console.log('Configuración Web3: HTTP Provider.', web3HttpProvider);
      }
    }
    resolve(web3);
  });