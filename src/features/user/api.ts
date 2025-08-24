
import { createApi } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: () => ({ data: undefined }),
  endpoints: () => ({})
  
})