import { createSlice } from '@reduxjs/toolkit';
import { CREATE_DAC_ROLE } from '../../constants/Role';
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
    setAddress: (state, action) => {
      //TODO: Implement
    },
    setUser: (state, action) => {
      state = new User(action.payload);
      return state;
    },
    setRoles: (state, action) => {
      const newRoles = action.payload;
      if (state && Array.isArray(newRoles)) state.roles = newRoles;
    },
    addRole: (state, action) => {
      const newRole = action.payload;
      if (state) state.roles.push(newRole);
    },
    removeRole: (state, action) => {
      const toRemoveRole = action.payload;
      //TODO: FIND AND REMOVE
    },
    clearUser: (state, action) => {
      //state.user = {};
      state = new User({});
    }
  },
});

export const { loadUser, setUser, setRoles, addRole, removeRole, clearUser } = userSlice.actions;

export const selectUser = state => state.user;
export const selectRoles = state => state.user.roles;

export const isDelegate = state => state.user.roles.includes(CREATE_DAC_ROLE);

export default userSlice.reducer;