import { createSlice } from '@reduxjs/toolkit';
import { CREATE_DAC_ROLE } from '../../constants/Role';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: undefined,
    roles: []
  },
  reducers: {
    loadUser: (state, action) => {
      // Se obtiene el estado actual.
    },
    setAddress: (state, action) => {
      //TODO: Implement
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRoles: (state, action) => {
      const newRoles = action.payload; 
      if (state.user && Array.isArray(newRoles)) state.roles = newRoles;
    },
    addRole: (state, action) => {
      const newRole = action.payload;
      if (state.user) state.roles.push(newRole);
    },
    removeRole: (state, action) => {
      const toRemoveRole = action.payload;
      //TODO: FIND AND REMOVE
    },
    clearUser: (state, action) => {
      state.user = {};
    }
  },
});



export const { setUser, setRoles, addRole, removeRole, clearUser } = userSlice.actions;

export const selectUser = state => state.user.user;
export const selectRoles = state => state.user.roles;

export const isDelegate = state => state.user.roles.includes(CREATE_DAC_ROLE);

export default userSlice.reducer;