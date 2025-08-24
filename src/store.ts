import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { useDispatch, useSelector } from 'react-redux';
import { flagContextReducer } from './features/flag/flagSlice';
import { userApi, userContextReducer } from './features/user';
import { createLogger } from 'redux-logger'

const logger = createLogger({
  collapsed: true,
  logErrors: false
});


export const store = configureStore({
  reducer: {
    userContext: userContextReducer,
    flagContext: flagContextReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(logger).concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
