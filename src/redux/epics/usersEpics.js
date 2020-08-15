import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import UserService from '../../services/UserService';

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
  mergeMap(action => userService.save(action.payload)),
  map(user => ({ type: 'user/endSave', payload: user }))
)

