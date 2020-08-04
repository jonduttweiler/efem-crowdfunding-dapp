import { createSlice } from '@reduxjs/toolkit';
import { CREATE_DAC_ROLE } from '../../constants/Role';

export const userSlice = createSlice({
  name: 'user',
  initialState: { //Could be a instance of User
    name: undefined,
    address: undefined,
    email: undefined,
    avatar: undefined,
    link: undefined,
    roles: []
  },
  reducers: {
    loadUser: (state, action) => {},// Se obtiene el estado actual
    setUser: (state, action) => {
      state = action.payload; //quizas habria que hacer un spread y ver que propiedades no son undef
    },
    clearUser: (state, action) => {
      state = {};
    }
  },
});


export const { loadUser, setUser, clearUser } = userSlice.actions;

export const selectUser = state => state.user;
export const selectRoles = state => state.user.roles;

export const isDelegate = state => state.user.roles.includes(CREATE_DAC_ROLE);

export default userSlice.reducer;