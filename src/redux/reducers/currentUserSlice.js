import { createSlice } from '@reduxjs/toolkit';
import User from '../../models/User';

/**
 * Estado inicial del usuario.
 */
const currentUserInitialState = {
  status: User.UNREGISTERED.toStore(),
  authenticated: false,
  roles: []
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: currentUserInitialState,
  reducers: {
    initCurrentUser: (state, action) => {
      // Cuando se carga el usuario, se obtiene un
      // estado inicial para ir cargándolo desde el Epic.
      return currentUserInitialState;
    },
    setCurrentUser: (state, action) => {
      action.payload.status = User.REGISTERED;
      return action.payload.toStore();
    },
    registerCurrentUser: (state, action) => {
      action.payload.status = User.REGISTERING;
      return action.payload.toStore();
    }
  },
});

export const { registerCurrentUser, initCurrentUser, setCurrentUser } = currentUserSlice.actions;

export const selectCurrentUser = state => new User(state.currentUser);
export const selectRoles = state => state.currentUser.roles;

export default currentUserSlice.reducer;