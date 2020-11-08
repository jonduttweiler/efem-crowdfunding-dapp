import { createSlice } from '@reduxjs/toolkit'
import Transaction from '../../models/Transaction'

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: [],
  reducers: {
    addTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      state.push(transactionStore);
    },
    updateTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      let index = state.findIndex(t => t.clientId === transactionStore.clientId);
      if (index != -1) {
        state[index] = transactionStore;
      }
    },
    deleteTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      let index = state.findIndex(t => t.clientId === transactionStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    }
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionsSlice.actions;

export const selectFirst = (state) => {
  if (state.transactions.length > 0) {
    return new Transaction(state.transactions[0]);
  }
  return undefined;
};

export default transactionsSlice.reducer;