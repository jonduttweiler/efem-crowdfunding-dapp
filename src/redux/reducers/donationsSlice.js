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
    addDonation: (state, action) => {
      // Se asigna el ID del lado cliente.
      action.payload.clientId = nanoid();
      var donation = new Donation(action.payload);
      state.push(donation);
    },
    updateDonationByClientId: (state, action) => {
      let donation = new Donation(action.payload);
      let index = state.findIndex(d => donation.clientId == d.clientId);
      if(index != -1) {
        state[index] = donation;
      }
    }
  },
});

export const { fetchDonations, resetDonations, addDonation, updateDonationByClientId } = donationsSlice.actions;

export const selectDonations = state => state.donations;
export const selectDonation = (state, id) => state.donations.find(c => c.id == id);

export default donationsSlice.reducer;
