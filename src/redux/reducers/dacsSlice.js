import { createSlice } from '@reduxjs/toolkit';
import DAC from '../../models/DAC';

export const DACsSlice = createSlice({
  name: 'dacs',
  initialState: [], //Array de DACS
  reducers: {
    fetchDacs: (state, action) => {
      //Las dacs se obtienen a traves del epic
    },
    resetDacs: (state, action) => {
      // Se resguardan las DACs Pendientes.
      var pendings = state.filter(d => d.status.name === DAC.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let dacStore = action.payload[i].toStore();
        state.push(dacStore);
      }
      pendings.forEach(d => state.push(d));
    },
    addDac: (state, action) => {
      let dacStore = action.payload.toStore();
      state.push(dacStore);
    },
    updateDacByClientId: (state, action) => {
      let dacStore = action.payload.toStore();
      let index = state.findIndex(d => d.clientId === dacStore.clientId);
      if (index != -1) {
        state[index] = dacStore;
      }
    },
    deleteDacByClientId: (state, action) => {
      let dacStore = action.payload.toStore();
      let index = state.findIndex(d => d.clientId === dacStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    }
  },
});

export const { addDac, updateDacByClientId, fetchDacs } = DACsSlice.actions;

export const selectDacs = state => {
  return state.dacs.map(function (dacStore) {
    return new DAC(dacStore);
  });
}
export const selectDac = (state, id) => {
  let dacStore = state.dacs.find(d => d.id === id);
  return new DAC(dacStore);
}

export default DACsSlice.reducer;
