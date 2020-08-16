import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

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
 * Epic que reacciona a la acción de obtención de un Milestone local,
 * busca el Milestone en el smart contract y envía la acción de
 * resetear el Milestone local.
 * 
 * @param action$ de Redux.
 */
export const fetchMilestoneEpic = action$ => action$.pipe(
  ofType('milestones/fetchMilestone'),
  mergeMap(action => crowdfundingContractApi.getMilestone(action.payload)),
  map(milestone => ({
    type: 'milestones/updateMilestoneById',
    payload: milestone
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
  })),
  catchError(error => of({
    type: 'milestones/deleteMilestoneByClientId',
    payload: error.milestone
  }))
)

/**
 * Retiro de fondos de un Milestone
 * 
 * @param action$ de Redux.
 */
export const milestoneWithdrawEpic = action$ => action$.pipe(
  ofType('milestones/withdraw'),
  mergeMap(action => crowdfundingContractApi.milestoneWithdraw(action.payload)),
  map(milestone => ({
    type: 'milestones/updateMilestoneByClientId',
    payload: milestone
  })),
  catchError(error => of({
    type: 'milestones/fetchMilestone',
    payload: error.milestone
  }))
)