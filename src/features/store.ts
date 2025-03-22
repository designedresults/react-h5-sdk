import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { configureUserApi } from "../services/userApi";
import { userContextReducer } from './userContextSlice';
import { M3API } from '@designedresults/m3api-h5-sdk';

export const m3api = new M3API()
export const userApi = configureUserApi(m3api);

export const store = configureStore({
  reducer: {
    userContext: userContextReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
