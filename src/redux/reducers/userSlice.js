import { createSlice } from '@reduxjs/toolkit';
import User from '../../models/User';


export const userSlice = createSlice({
  name: 'user',
  initialState: new User(),
  reducers: {
    loadUser: (state, action) => {
      // Se obtiene el estado actual.
      // Se retorna el objeto por este error:
      // A case reducer on a non-draftable value must not return undefined
      return state;
    },
    setUser: (state, action) => { 
      const { name, address, email, avatar, linkedin, roles, balance, registered } = action.payload;
      return new User({ name, address, email, avatar, linkedin, roles, balance, registered });
    },
    saveUser: (state, action) => {
      state.endSave = false; 
      return state;
    },
    endSave: (prevState, action) => {
      const state = prevState.clone();
      state.endSave = true;
      state.hasError = false;
      state.errorOnSave = undefined;
      
      const { address, email, name, avatar, linkedin } = action.payload;
      state.address = address;
      state.email = email;
      state.name = name;
      state.avatar = avatar;
      state.linkedin = linkedin;
      
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

export const { loadUser, setUser, clearUser, saveUser } = userSlice.actions;

export const selectUser = state => state.user.clone();
export const selectRoles = state => state.user.roles;


export const endSave = state => state.user.endSave;
export const hasError = state => state.user.hasError;
export const errorOnSave = state => state.user.errorOnSave;

export default userSlice.reducer;