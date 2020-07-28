import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import DAC from '../../models/DAC';

export const DACsSlice = createSlice({
  name: 'dacs',
  initialState: [],
  reducers: {
    addDac: (state, action) => {
        // Se asigna el ID del lado cliente.
        action.payload.clientId = nanoid();
        const dac = new DAC(action.payload);
        state.push(dac);
    },
    fetchDacs: (state, action) => {
      // Solo se obtiene el estado actual.
      //Las dacs se obtienen a traves del epic
    },
    resetDacs:(state, action) => {
      console.log("resetDacs:",action.payload) //action.payload ya es un array de isntancias de la clase DAC
      const updatedDacs = action.payload; //.map()...
      return updatedDacs;
    },
    updateDacByClientId: (state, action) => {
      const updatedDac = new DAC(action.payload);
      const dacIdx = state.findIndex(d => d.clientId === updatedDac.clientId);
      if (dacIdx > -1) {
        state[dacIdx] = updatedDac;
      } else {
        state.push(updatedDac);
      }

    }
  },
});

export const { addDac, updateDacByClientId, fetchDacs } = DACsSlice.actions;

export const selectDACs = state => state.dacs;
export const selectDAC = (state, id) => state.dacs.find(dac => dac.id === id);

export default DACsSlice.reducer;
