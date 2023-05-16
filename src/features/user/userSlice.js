import { createSlice } from "@reduxjs/toolkit";

const log = (state, action) => {
     state = action.payload;
     console.log(state);
};

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: log,
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
