import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;

