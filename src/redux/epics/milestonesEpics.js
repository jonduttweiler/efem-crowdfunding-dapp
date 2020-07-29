import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import CrowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

const crowdfundingContractApi = new CrowdfundingContractApi();

/**
 * Epic que reacciona a la acción de obtención de Milestones locales,
 * busca los Milestones en el smart contract y envía la acción de
 * resetear los Milestones locales.
 * 
 * @param action$ de Redux.
 */
export const fetchMilestonesEpic = action$ => action$.pipe(
  ofType('milestones/fetchMilestones'),
  mergeMap(action => crowdfundingContractApi.getMilestones()),
  map(milestones => ({
    type: 'milestones/resetMilestones',
    payload: milestones
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de milestone local,
 * almacena el milestone en el smart contract y envía la acción de
 * actualizar el milestone local.
 * 
 * @param action$ de Redux.
 */
export const addMilestoneEpic = action$ => action$.pipe(
  ofType('milestones/addMilestone'),
  mergeMap(action => crowdfundingContractApi.saveMilestone(action.payload)),
  map(milestone => ({
    type: 'milestones/updateMilestoneByClientId',
    payload: milestone
  }))
)