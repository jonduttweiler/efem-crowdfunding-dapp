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
      var pendings = state.filter(c => c.isPending);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        // Se asigna el ID del lado cliente.
        action.payload[i].clientId = nanoid();
        var campaign = new Campaign(action.payload[i]);
        state.push(campaign);
      }
      pendings.forEach(c => state.push(c));
    },
    addCampaign: (state, action) => {
      // Se asigna el ID del lado cliente.
      action.payload.clientId = nanoid();
      var campaign = new Campaign(action.payload);
      state.push(campaign);
    },
    updateCampaignByClientId: (state, action) => {
      let campaign = new Campaign(action.payload);
      let index = state.findIndex(c => campaign.clientId === c.clientId);
      if(index != -1) {
        state[index] = campaign;
      }
    }
  },
});

export const { fetchCampaigns, resetCampaigns, addCampaign, updateCampaignByClientId } = campaignsSlice.actions;

export const selectCampaigns = state => state.campaigns;
export const selectCampaign = (state, id) => state.campaigns.find(c => c.id === id);
export const selectCampaignsByDac = (state, dacId) => state.campaigns.filter(c => c.dacIds.includes(dacId));

export default campaignsSlice.reducer;
