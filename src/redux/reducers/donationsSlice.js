import { createSlice } from '@reduxjs/toolkit';
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
      var pendings = state.filter(d => d.status.name === Donation.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let donationStore = action.payload[i].toStore();
        state.push(donationStore);
      }
      pendings.forEach(d => state.push(d));
    },
    fetchDonationsByIds: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    /**
     * Incorpora las donaciones al estado global.
     */
    mergeDonations: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        let donationStore = action.payload[i].toStore();
        let replaced = false;
        for (let j = 0; j < state.length; j++) {
          // Se compara por su ID porque lo comparten aquellas
          // donaciones que están en la persistidas.
          if (state[j].id === donationStore.id) {
            state[j] = donationStore;
            replaced = true;
            break;
          }
        }
        if (!replaced) {
          state.push(donationStore);
        }
      }
    },
    addDonation: (state, action) => {
      let donationStore = action.payload.toStore();
      state.push(donationStore);
    },
    updateDonationByClientId: (state, action) => {
      let donationStore = action.payload.toStore();
      let index = state.findIndex(d => d.clientId === donationStore.clientId);
      if (index != -1) {
        state[index] = donationStore;
      }
    },
    deleteDonationByClientId: (state, action) => {
      let donationStore = action.payload.toStore();
      let index = state.findIndex(d => d.clientId === donationStore.clientId);
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

export const selectDonation = (state, id) => {
  let donationStore = state.donations.find(d => d.id === id);
  return new Donation(donationStore);
}
export const selectDonations = state => {
  return state.donations.map(function (donationStore) {
    return new Donation(donationStore);
  });
}
export const selectDonationsByEntity = (state, entityId) => {
  return state.donations.filter(d => d.entityId === entityId).map(function (donationStore) {
    return new Donation(donationStore);
  });
}
export const selectDonationsByIds = (state, donationIds) => {
  return state.donations.filter(d => donationIds.includes(d.id)).map(function (donationStore) {
    return new Donation(donationStore);
  });
}

export default donationsSlice.reducer;
