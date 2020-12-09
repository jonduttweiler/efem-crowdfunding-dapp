import { CrowdfundingAbi, ExchangeRateProviderAbi } from '@acdi/give4forests-crowdfunding-contract';
import getWeb3 from './getWeb3';
import config from '../../configuration';

let network;

export default async () => {

  if (!network) {

    const web3 = await getWeb3();

    let newNetwork = Object.assign({}, config);

    newNetwork.crowdfunding = new web3.eth.Contract(CrowdfundingAbi, newNetwork.crowdfundingAddress);
    console.log('newNetwork.exchangeRateProviderAddress', newNetwork.exchangeRateProviderAddress);
    newNetwork.exchangeRateProvider = new web3.eth.Contract(ExchangeRateProviderAbi, newNetwork.exchangeRateProviderAddress);

    network = newNetwork;
  }

  return network;
};
