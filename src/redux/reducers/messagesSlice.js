import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      // Se asigna el ID del lado cliente.
      action.payload.clientId = nanoid();
      state.push(action.payload);
    },
    deleteMessage: (state, action) => {
      let index = state.findIndex(c => action.payload.clientId == c.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    }
  },
});

export const { addMessage, deleteMessage } = messagesSlice.actions;

export const selectNext = (state) => {
  if (state.messages.length > 0) {
    return state.messages[0];
  }
  return undefined;
};

export default messagesSlice.reducer;