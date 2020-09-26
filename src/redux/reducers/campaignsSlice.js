import { createSlice } from '@reduxjs/toolkit';
import Campaign from '../../models/Campaign';

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: [],
  reducers: {
    fetchCampaigns: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    fetchCampaign: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetCampaigns: (state, action) => {
      // Se resguardan las Campaigns Pendientes.
      var pendings = state.filter(c => c.status.name === Campaign.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let campaignStore = action.payload[i].toStore();
        state.push(campaignStore);
      }
      pendings.forEach(c => state.push(c));
    },
    saveCampaign: (state, action) => {
      const campaign = action.payload;
      campaign.status = Campaign.PENDING;
      const campaignStore = campaign.toStore();
      const index = state.findIndex(c => c.clientId === campaignStore.clientId);

      if (index != -1) {
        state[index] = campaignStore;
      } else {
        state.push(campaignStore);
      }
    },
    updateCampaignByClientId: (state, action) => {
      let campaignStore = action.payload.toStore();
      let index = state.findIndex(c => c.clientId === campaignStore.clientId);
      if (index != -1) {
        state[index] = campaignStore;
      }
    },
    deleteCampaignByClientId: (state, action) => {
      let campaignStore = action.payload.toStore();
      let index = state.findIndex(c => c.clientId === campaignStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    },
    updateCampaign: (state, action) => {
      let campaignStore = action.payload.toStore();
      let index = state.findIndex(c => c.id === campaignStore.id);
      if (index != -1) {
        state[index] = campaignStore;
      }
    },
  },
});

export const { fetchCampaigns,
  fetchCampaign,
  resetCampaigns,
  saveCampaign,
  updateCampaignByClientId } = campaignsSlice.actions;

export const selectCampaigns = state => {
  return state.campaigns.map(function (campaignStore) {
    return new Campaign(campaignStore);
  });
}
export const selectCampaign = (state, id) => {
  let campaignStore = state.campaigns.find(c => c.id === id);
  if (campaignStore) {
    return new Campaign(campaignStore);
  }
  return undefined;
}
export const selectCampaignsByDac = (state, dacId) => {
  return state.campaigns.filter(c => c.dacIds.includes(dacId)).map(function (campaignStore) {
    return new Campaign(campaignStore);
  });
}
export const selectCampaignsByIds = (state, ids) => {
  return state.campaigns.filter(c => ids.includes(c.id)).map(function (campaignStore) {
    return new Campaign(campaignStore);
  });
}

export default campaignsSlice.reducer;
