import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

/**
 * Epic que reacciona a la acción de obtención de dacs locales,
 * busca las dacs en el smart contract y envía la acción de
 * resetear las dacs locales.
 * 
 * @param action$ de Redux.
 */
export const fetchDacsEpic = action$ => action$.pipe(
  ofType('dacs/fetchDacs'),
  mergeMap(action => crowdfundingContractApi.getDacs()),
  map(dacs => ({
    type: 'dacs/resetDacs',
    payload: dacs
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de dac local,
 * almacena la dac en el smart contract y envía la acción de
 * dac la dac local.
 * 
 * @param action$ de Redux.
 */
export const addDacEpic = action$ => action$.pipe(
  ofType('dacs/addDac'),
  mergeMap(action => crowdfundingContractApi.saveDAC(action.payload)),
  map(dac => ({
    type: 'dacs/updateDacByClientId',
    payload: dac
  })),
  catchError(error => of({
    type: 'dacs/deleteDacByClientId',
    payload: error.dac
  }))
)