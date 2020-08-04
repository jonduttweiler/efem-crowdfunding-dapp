import { createSlice } from '@reduxjs/toolkit';
import { CREATE_DAC_ROLE, CREATE_CAMPAIGN_ROLE, CREATE_MANAGER_ROLE, CREATE_MILESTONE_ROLE} from '../../constants/Role';

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
      //No se puede asignar directamente state = action.payload; 
      const { name, address, email, avatar, link, roles } = action.payload;
      state.name = name;
      state.address = address;
      state.email = email;
      state.avatar = avatar;
      state.link = link;
      state.roles = roles;

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
export const isCampaignManager = state => state.user.roles.includes(CREATE_CAMPAIGN_ROLE);
export const isMilestoneManager = state => state.user.roles.includes(CREATE_MILESTONE_ROLE);

export default userSlice.reducer;