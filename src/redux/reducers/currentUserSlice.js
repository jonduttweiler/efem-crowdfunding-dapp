import { createSlice } from '@reduxjs/toolkit';
import User from '../../models/User';

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    authenticated: false,
    roles: []
  },
  reducers: {
    loadCurrentUser: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    setCurrentUser: (state, action) => {
      return action.payload.toStore();
    },
    /*setUser: (state, action) => { 
      const { name, address, email, avatar, url, roles, balance, registered } = action.payload;
      return new User({ name, address, email, avatar, url, roles, balance, registered });
    },*/
    saveUser: (state, action) => {
      state.endSave = false; 
      return state;
    },
    endSave: (prevState, action) => {
      const state = prevState.clone();
      state.endSave = true;
      state.hasError = false;
      state.errorOnSave = undefined;
      
      const { address, email, name, avatar, url } = action.payload;
      state.address = address;
      state.email = email;
      state.name = name;
      state.avatar = avatar;
      state.url = url;
      
      return state;
    },
    endSaveError: (prevState,action) => { 
      const error = action.payload;
      const newState = prevState.clone();

      newState.endSave = true;
      newState.hasError = true;
      newState.errorOnSave = error;
      return newState;
    },
    clearUser: (state, action) => {
      state = new User();
      return state;
    }
  },
});

export const { clearUser, saveUser, loadCurrentUser, setCurrentUser } = currentUserSlice.actions;

//export const selectUser = state => state.currentUser.clone();
export const selectCurrentUser = state => new User(state.currentUser);
export const selectRoles = state => state.currentUser.roles;
export const endSave = state => state.currentUser.endSave;
export const hasError = state => state.currentUser.hasError;
export const errorOnSave = state => state.currentUser.errorOnSave;

export default currentUserSlice.reducer;