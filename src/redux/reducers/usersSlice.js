import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: 'usersRoles',
    initialState: [], //List of User instances with roles
    reducers: {
        loadUsersRoles: (state, action) => {
            return state;
        },
        setUsersRoles: (state, action) => {
            state = action.payload;
            return state;
        }   
    },
});

export const { loadUsersRoles } = usersSlice.actions;

export const selectUsersByRole = (state, role) => state.usersRoles.filter(user => user.hasRole(role));
export const selectUsersByRoles = (state, roles) => state.usersRoles.filter(user => user.hasAnyRoles(roles));

export const delegates = state => state.usersRoles.filter(user => user.isDelegate());
export const campaignManagers = state => state.usersRoles.filter(user => user.isCampaignManager());
export const campaignReviewers = state => state.usersRoles.filter(user => user.isCampaignReviewer());
export const milestoneManagers = state => state.usersRoles.filter(user => user.isMilestoneManager());
export const milestoneReviewers = state => state.usersRoles.filter(user => user.isMilestoneReviewer());
export const recipients = state => state.usersRoles.filter(user => user.isRecipient());

export default usersSlice.reducer;
