import { AlertColor } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  message: string | null;
  moreInfo: any | null;
  severity: AlertColor | null;
  isLoading: boolean;
}

const initialState: IAppState = {
  message: null,
  moreInfo: null,
  severity: null,
  isLoading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      if (typeof action.payload === 'string') {
        state.message = action.payload;
        state.moreInfo = null;
      } else {
        state.message = action.payload.message ?? null;
        state.moreInfo = action.payload.moreInfo ?? null;
      }
      state.severity = 'success';
    },
    sendError: (state, action) => {
      if (typeof action.payload === 'string') {
        state.message = action.payload;
        state.moreInfo = null;
      } else {
        state.message = action.payload.message ?? null;
        state.moreInfo = action.payload.moreInfo ?? null;
      }
      state.severity = 'error';
    },
    clearMessage: state => {
      state.message = null;
      state.severity = 'success';
    },
    startLoading: state => {
      state.isLoading = true;
    },
    finishLoading: state => {
      state.isLoading = false;
    },
  },
});

export const { sendMessage, sendError, clearMessage, startLoading, finishLoading } = appSlice.actions;

export const appReducer = appSlice.reducer;
