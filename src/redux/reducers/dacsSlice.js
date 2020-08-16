import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import DAC from '../../models/DAC';

export const DACsSlice = createSlice({
  name: 'dacs',
  initialState: [], //Array de DACS
  reducers: {
    addDac: (state, action) => {
        action.payload.clientId = nanoid();// Se asigna el ID del lado cliente.
        const dac = new DAC(action.payload);
        state.push(dac);
    },
    fetchDacs: (state, action) => {
      //Las dacs se obtienen a traves del epic
    },
    resetDacs:(state, action) => {
      // Se resguardan las DACs Pendientes.
      var pendings = state.filter(d => d.isPending);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        // Se asigna el ID del lado cliente.
        action.payload[i].clientId = nanoid();
        var dac = new DAC(action.payload[i]);
        state.push(dac);
      }
      pendings.forEach(d => state.push(d));
    },
    updateDacByClientId: (state, action) => {
      const updatedDac = new DAC(action.payload);
      const dacIdx = state.findIndex(d => d.clientId === updatedDac.clientId);
      if (dacIdx > -1) state[dacIdx] = updatedDac;
    },
    deleteDacByClientId: (state, action) => {
      let index = state.findIndex(d => action.payload.clientId == d.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    }
  },
});

export const { addDac, updateDacByClientId, fetchDacs } = DACsSlice.actions;

export const selectDACs = state => state.dacs;
export const selectDAC = (state, id) => state.dacs.find(dac => dac.id === id);
export const SelectDACtxHash = (state, id) => { 
  const dac = state.dacs.find(dac => dac.id === id);
  if(dac){
    return dac.txHash;
  }
}
export const isDACConfirmed = (state, id) => state.dacs.find(dac => dac.id === id); //esto es una dac, hay que ver si tiene un txHash

export default DACsSlice.reducer;
