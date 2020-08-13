import { createSlice } from '@reduxjs/toolkit';

export const usersRolesSlice = createSlice({
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

export const { loadUsersRoles } = usersRolesSlice.actions;

export const delegates = state => state.usersRoles.filter(user => user.isDelegate());
export const campaignManagers = state => state.usersRoles.filter(user => user.isCampaignManager());
export const campaignReviewers = state => state.usersRoles.filter(user => user.isCampaignReviewer());
export const milestoneManagers = state => state.usersRoles.filter(user => user.isMilestoneManager());
export const milestoneReviewers = state => state.usersRoles.filter(user => user.isMilestoneReviewer());

export default usersRolesSlice.reducer;