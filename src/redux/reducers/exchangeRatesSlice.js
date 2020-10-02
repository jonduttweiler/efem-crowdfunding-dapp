import { createSlice } from '@reduxjs/toolkit'
import ExchangeRate from '../../models/ExchangeRate'

export const exchangeRatesSlice = createSlice({
  name: 'exchangeRates',
  initialState: [],
  reducers: {
    fetchExchangeRates: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetExchangeRates: (state, action) => {
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let exchangeRateStore = action.payload[i].toStore();
        state.push(exchangeRateStore);
      }
    },
  },
});

export const { fetchExchangeRates } = exchangeRatesSlice.actions;

export const selectExchangeRates = (state) => {
  return state.exchangeRates.map(function (exchangeRateStore) {
    return new ExchangeRate(exchangeRateStore);
  });
};

export const selectExchangeRateByToken = (state, tokenAddress) => {
  let exchangeRate = state.exchangeRates.find(er => er.tokenAddress === tokenAddress);
  if (exchangeRate) {
    return new ExchangeRate(exchangeRate);
  }
  return undefined;
};

export default exchangeRatesSlice.reducer;