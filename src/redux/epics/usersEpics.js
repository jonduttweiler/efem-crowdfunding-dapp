import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import UserService from '../../services/UserService';

const userService = new UserService();

export const loadUsersRolesEpic = action$ => action$.pipe(
  ofType('users/loadUsersRoles'),
  mergeMap(action => userService.getUsersRoles()),
  map(usersList => ({ type: 'users/setUsersRoles', payload: usersList }))
)
