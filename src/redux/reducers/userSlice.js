import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: 'Dummy User',
    address: "",
    roles: []
  },
  reducers: {
    login: (state, action) => {},
    web3Injected: (state, action) => { }
  },
});

export default userSlice.reducer;
