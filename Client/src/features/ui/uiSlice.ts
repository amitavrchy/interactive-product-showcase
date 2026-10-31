import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  chatOpen: boolean;
  preloaderDone: boolean;
  reducedMotion: boolean;
};

const initialState: UiState = {
  chatOpen: false,
  preloaderDone: false,
  reducedMotion: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.chatOpen = action.payload;
    },
    setPreloaderDone(state, action: PayloadAction<boolean>) {
      state.preloaderDone = action.payload;
    },
    setReducedMotion(state, action: PayloadAction<boolean>) {
      state.reducedMotion = action.payload;
    },
  },
});

export const { setChatOpen, setPreloaderDone, setReducedMotion } = uiSlice.actions;
export default uiSlice.reducer;
