import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit'
import Milestone from '../../models/Milestone';

export const milestonesSlice = createSlice({
  name: 'milestones',
  initialState: [],
  reducers: {
    fetchMilestones: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetMilestones: (state, action) => {
      // Se resguardan los Milestones Pendientes.
      var pendings = state.filter(m => m.isPending);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        // Se asigna el ID del lado cliente.
        action.payload[i].clientId = nanoid();
        var milestone = new Milestone(action.payload[i]);
        state.push(milestone);
      }
      pendings.forEach(m => state.push(m));
    },
    addMilestone: (state, action) => {
      // Se asigna el ID del lado cliente.
      action.payload.clientId = nanoid();
      var milestone = new Milestone(action.payload);
      state.push(milestone);
    },
    updateMilestoneByClientId: (state, action) => {
      let milestone = new Milestone(action.payload);
      let index = state.findIndex(c => milestone.clientId == c.clientId);
      if(index != -1) {
        state[index] = milestone;
      }
    },
    withdraw: (state, action) => {
      
    }
  },
});

export const {
  fetchMilestones, 
  resetMilestones, 
  addMilestone, 
  updateMilestoneByClientId, 
  withdraw } = milestonesSlice.actions;

export const selectMilestone = (state, id) => state.milestones.find(m => m.id === id);
export const selectMilestones = state => state.milestones;
export const selectMilestonesByCampaign = (state, campaignId) => state.milestones.filter(m => m.campaignId === campaignId);

export default milestonesSlice.reducer;