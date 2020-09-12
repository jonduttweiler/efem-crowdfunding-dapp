import { createSlice } from '@reduxjs/toolkit';

export const usersRolesSlice = createSlice({
    name: 'userRoles',
    initialState: [], //List of User instances with roles
    reducers: {
        loadUsersRoles: (state, action) => {
            return state;
        },
        setUsers: (state, action) => {
            state = action.payload;
            return state;
        }   
    },
});

export const { loadUsersRoles } = usersRolesSlice.actions;

export const delegates = state => state.userRoles.filter(user => user.isDelegate());
export const campaignManagers = state => state.userRoles.filter(user => user.isCampaignManager());
export const campaignReviewers = state => state.userRoles.filter(user => user.isCampaignReviewer());
export const milestoneManagers = state => state.userRoles.filter(user => user.isMilestoneManager());
export const milestoneReviewers = state => state.userRoles.filter(user => user.isMilestoneReviewer());
export const recipients = state => state.userRoles.filter(user => user.isRecipient());

export default usersRolesSlice.reducer;