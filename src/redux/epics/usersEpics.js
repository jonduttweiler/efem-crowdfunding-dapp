import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import CrowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';
import { Observable } from 'rxjs';
import WalletApi from '../../lib/blockchain/WalletApi';

const crowdfundingContractApi = new CrowdfundingContractApi();
const userService = new UserService();

export const loadUserEpic = action$ => action$.pipe(
  ofType('user/loadUser'),
  mergeMap(action => userService.loadUser(action.payload)),
  map(user => ({ type: 'user/setUser', payload: user }))
)

export const setUserEpic = action$ => action$.pipe(
  ofType('user/setUser'),
  mergeMap(action => {
    const user = action.payload;
    if(user.address){
      return crowdfundingContractApi.getRoles(user.address);
    } else {
      return [];
    }
  }), 
  map(roles => ({ type: 'user/setRoles', payload: roles }))
)



