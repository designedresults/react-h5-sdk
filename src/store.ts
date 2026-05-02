import { type Action, configureStore, type ThunkAction } from '@reduxjs/toolkit';

import { useDispatch, useSelector } from 'react-redux';
import { userApi, userContextReducer } from './features/user';



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
