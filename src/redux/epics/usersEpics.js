import { ofType } from 'redux-observable';
import { map, mergeMap, catchError } from 'rxjs/operators'
import UserService from '../../services/UserService';
import { of } from 'rxjs';

const userService = new UserService();

export const loadUserEpic = (action$, state$) => action$.pipe(
  ofType('user/loadUser'),
  mergeMap(action => {
    let user = state$.value.user;
    return userService.loadUser(user);
  }),
  map(user => ({ type: 'user/setUser', payload: user }))
)

export const saveUserEpic = (action$) => action$.pipe(
  ofType('user/saveUser'),
  mergeMap(
    action => userService.save(action.payload).pipe(
      map(user => ({ type: 'user/endSave', payload: user })),
      catchError(error => of({type: 'user/endSaveError',payload: error,error: true}))
    )
  
  
  ),
  
)

