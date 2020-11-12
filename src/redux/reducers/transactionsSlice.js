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

export const selectLastCreated = (state) => {
  let transactionsCreated = state.transactions.filter(t => t.status.name === Transaction.CREATED.name);
  let length = transactionsCreated.length;
  if(length > 0) {
    return new Transaction(state.transactions[length - 1]);
  } else {
    return undefined;
  }  
};

export const selectPendings = (state) => {
  return state.transactions.filter(t => t.status.name === Transaction.PENDING.name).map(function (transactionStore) {
    return new Transaction(transactionStore);
  });
}

export default transactionsSlice.reducer;