import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: 'Dummy User'
  },
  reducers: {
    login: (state, action) => {}
  },
});

export default userSlice.reducer;
