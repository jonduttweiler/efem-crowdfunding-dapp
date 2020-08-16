import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit'
import Donation from '../../models/Donation';

export const donationsSlice = createSlice({
  name: 'donations',
  initialState: [],
  reducers: {
    fetchDonations: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetDonations: (state, action) => {
      // Se resguardan las Donations Pendientes.
      var pendings = state.filter(d => d.isPending);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        // Se asigna el ID del lado cliente.
        action.payload[i].clientId = nanoid();
        var donation = new Donation(action.payload[i]);
        state.push(donation);
      }
      pendings.forEach(c => state.push(c));
    },
    fetchDonationsByIds: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    /**
     * Incorpora las donaciones al estado global.
     */
    mergeDonations: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        // Se asigna el ID del lado cliente.
        action.payload[i].clientId = nanoid();
        var donation = new Donation(action.payload[i]);
        let replaced = false;
        for (let j = 0; j < state.length; j++) {
          // Se compara por su ID porque lo comparten aquellas
          // donaciones que están en la persistidas.
          if (state[j].id == donation.id) {
            state[j] = donation;
            replaced = true;
            break;
          }
        }
        if (!replaced) {
          state.push(donation);
        }
      }
    },
    addDonation: (state, action) => {
      // Se asigna el ID del lado cliente.
      action.payload.clientId = nanoid();
      var donation = new Donation(action.payload);
      state.push(donation);
    },
    updateDonationByClientId: (state, action) => {
      let donation = new Donation(action.payload);
      let index = state.findIndex(d => donation.clientId == d.clientId);
      if (index != -1) {
        state[index] = donation;
      }
    },
    deleteDonationByClientId: (state, action) => {
      let index = state.findIndex(d => action.payload.clientId == d.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    }
  },
});

export const { fetchDonations,
  resetDonations,
  fetchDonationsByIds,
  mergeDonations,
  addDonation,
  updateDonationByClientId } = donationsSlice.actions;

export const selectDonation = (state, id) => state.donations.find(d => d.id === id);
export const selectDonations = state => state.donations;
export const selectDonationsByEntity = (state, entityId) => state.donations.filter(d => d.entityId === entityId);
export const selectDonationsByIds = (state, donationIds) => state.donations.filter(d => donationIds.includes(d.id));

export default donationsSlice.reducer;
