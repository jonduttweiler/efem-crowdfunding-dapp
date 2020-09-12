import { createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import User from '../../models/User';

export const usersSlice = createSlice({
    name: 'users',
    initialState: [], //List of User instances with roles
    reducers: {
        fetchUserByAddress: (state, action) => {
            // Solo se obtiene el estado actual.
        },
        /**
         * Incorpora el user al estado global.
         */
        mergeUser: (state, action) => {
            let userStore = action.payload.toStore();
            let index = state.findIndex(u => u.address === userStore.address);
            if (index != -1) {
                // El usuario ya existe localmente,
                // por lo que se realiza un merge de sus datos con los actuales.
                let u = state[index];
                let address = userStore.address;
                let name = userStore.name !== '' ? userStore.name : u.name;
                let email = userStore.email !== '' ? userStore.email : u.email;
                let url = userStore.url !== '' ? userStore.url : u.url;
                let avatar = userStore.avatar !== '' ? userStore.avatar : u.avatar;
                let roles = userStore.roles.length !== 0 ? userStore.roles : u.roles;
                let balance = userStore.balance !== new BigNumber(0) ? userStore.balance : u.balance;
                let registered = userStore.registered === true ? userStore.registered : u.registered;
                state[index] = {
                    address,
                    name,
                    email,
                    url,
                    avatar,
                    roles,
                    balance,
                    registered
                };
            } else {
                // El usuario es nuevo localmente
                state.push(userStore);
            }
        },
        loadUsersRoles: (state, action) => {
            return state;
        },
        setUsersRoles: (state, action) => {
            state = action.payload;
            return state;
        }
    },
});

export const { loadUsersRoles, fetchUserByAddress } = usersSlice.actions;

export const selectUserByAddress = (state, address) => {
    let userStore = state.users.find(u => u.address === address);
    return new User(userStore);
}
export const selectUsersByRoles = (state, roles) => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.hasAnyRoles(roles));
}
export const delegates = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isDelegate());
}
export const campaignManagers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isCampaignManager());
}
export const campaignReviewers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isCampaignReviewer());
}
export const milestoneManagers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isMilestoneManager());
}
export const milestoneReviewers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isMilestoneReviewer());
}
export const recipients = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isRecipient());
}

export default usersSlice.reducer;
