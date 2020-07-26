import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import CrowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

const crowdfundingContractApi = new CrowdfundingContractApi();

/**
 * Epic que reacciona a la acción de obtención de campaigns locales,
 * busca las campaigns en el smart contract y envía la acción de
 * resetear las campaigns locales.
 * 
 * @param action$ de Redux.
 */
export const fetchCampaignsEpic = action$ => action$.pipe(
  ofType('campaigns/fetchCampaigns'),
  mergeMap(action => crowdfundingContractApi.getCampaigns()),
  map(campaigns => ({
    type: 'campaigns/resetCampaigns',
    payload: campaigns
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de campaign local,
 * almacena la campaign en el smart contract y envía la acción de
 * actualizar la campaign local.
 * 
 * @param action$ de Redux.
 */
export const addCampaignEpic = action$ => action$.pipe(
  ofType('campaigns/addCampaign'),
  mergeMap(action => crowdfundingContractApi.saveCampaign(action.payload)),
  map(campaign => ({
    type: 'campaigns/updateCampaignByClientId',
    payload: campaign
  }))
)