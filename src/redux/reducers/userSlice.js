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
    setUser: (state, action) => { //No se puede asignar directamente state = action.payload; 
      const { name, address, email, avatar, link, roles, balance, registered } = action.payload;
      return new User({ name, address, email, avatar, link, roles, balance, registered });
    },
    saveUser: (state, action) => {
      state.isSaved = false;
      return state;
    },
    endSave: (state, action) => {
      state.isSaved = true;
      
      const { address, email, name, avatar } = action.payload;
      state.address = address;
      state.email = email;
      state.name = name;
      state.avatar = avatar;
      
      return state;
    },
    clearUser: (state, action) => {
      state = new User();
      return state;
    }
  },
});

export const { loadUser, setUser, clearUser, saveUser } = userSlice.actions;

export const selectUser = state => state.user;
export const selectRoles = state => state.user.roles;


export const isSaved = state => state.user.isSaved;

export default userSlice.reducer;