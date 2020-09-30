import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

export const fetchExchangeRatesEpic = action$ => action$.pipe(
  ofType('exchangeRates/fetchExchangeRates'),
  mergeMap(action => crowdfundingContractApi.getExchangeRates()),
  map(exchangeRates => ({
    type: 'exchangeRates/resetExchangeRates',
    payload: exchangeRates
  }))
)