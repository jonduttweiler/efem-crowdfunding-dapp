import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: undefined,
    roles: []
  },
  reducers: {
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

export default userSlice.reducer;