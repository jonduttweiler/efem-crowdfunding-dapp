import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import UserService from '../../services/UserService';



const userService = new UserService();

export const loadUserEpic = action$ => action$.pipe(
  ofType('user/loadUser'),
  mergeMap(action => userService.loadUser(action.payload)),
  map(user => ({ type: 'user/setUser', payload: user }))
)
