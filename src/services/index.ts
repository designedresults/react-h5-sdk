import { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/dist/query/react';
import { configureUserApi } from './userApi';

export const fnBaseQuery: BaseQueryFn<
  (api: BaseQueryApi, extraOptions: any) => Promise<any>,
  unknown,
  unknown,
  {},
  {}
> = (fn, api, extraOptions) => {
  return fn(api, extraOptions);
};

export {configureUserApi}