import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { configureUserApi } from "../services/userApi";
import { appReducer } from './appSlice';
import { userContextReducer } from './userContextSlice';
import { configureMI } from '..';

export const mi = configureMI();
export const userApi = configureUserApi(mi);

export const store = configureStore({
  reducer: {
    app: appReducer,
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
