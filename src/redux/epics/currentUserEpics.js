import { ofType } from 'redux-observable';
import { map, mergeMap, catchError } from 'rxjs/operators'
import UserService from '../../services/UserService';
import { of } from 'rxjs';
import User from '../../models/User'

const userService = new UserService();

/**
 * Epic que reacciona a la acción de obtención del usuario actual local,
 * busca el usuario actual con el servicio y envía la acción de
 * resetear el usuario actual.
 * 
 * @param action$ de Redux.
 */
export const loadCurrentUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/loadCurrentUser'),
  mergeMap(action => {
    let currentUser = new User(state$.value.currentUser);
    return userService.loadCurrentUser(currentUser);
  }),
  map(currentUser => ({
    type: 'currentUser/setCurrentUser',
    payload: currentUser
  }))
)

/*export const loadUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/loadUser'),
  mergeMap(action => {
    let user = state$.value.currentUser;
    return userService.loadUser(user);
  }),
  map(user => ({ type: 'currentUser/setUser', payload: user }))
)*/

export const saveUserEpic = (action$) => action$.pipe(
  ofType('currentUser/saveUser'),
  mergeMap(
    action => userService.save(action.payload).pipe(
      map(user => ({ type: 'currentUser/endSave', payload: user })),
      catchError(error => of({type: 'currentUser/endSaveError',payload: error,error: true}))
    )
  
  
  ),
  
)

