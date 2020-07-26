import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit'
import Campaign from '../../models/Campaign';

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: [],
  reducers: {
    fetchCampaigns: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetCampaigns: (state, action) => {
      // Se resguardan las Campaigns Pendientes.
      var campaignPendings = state.filter(c => c.myStatus == Campaign.PENDING);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        // Se asigna el ID del lado cliente.
        action.payload[i].clientId = nanoid();
        var campaign = new Campaign(action.payload[i]);
        state.push(campaign);
      }
      for (let i = 0; i < campaignPendings.length; i++) {
        var campaign = campaignPendings[i];
        state.push(campaign);        
      }
    },
    addCampaign: (state, action) => {
      // Se asigna el ID del lado cliente.
      action.payload.clientId = nanoid();
      var campaign = new Campaign(action.payload);
      state.push(campaign);
    },
    updateCampaignByClientId: (state, action) => {
      var campaign = new Campaign(action.payload);
      for (let i = 0; i < state.length; i++) {
        if(campaign.clientId == state[i].clientId) {
          state[i] = campaign;
          break;
        }        
      }
    }
  },
});

export const { fetchCampaigns, resetCampaigns, addCampaign, updateCampaignByClientId } = campaignsSlice.actions;

export const selectCampaigns = state => state.campaigns;
export const selectCampaign = function(state, id) {
  for (let i = 0; i < state.campaigns.length; i++) {
    const campaign = state.campaigns[i];
    if(campaign.id == id) {
      return campaign;
    }    
  }
  return null;
}

export default campaignsSlice.reducer;
