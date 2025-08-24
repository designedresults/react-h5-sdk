import { M3APIRequest } from "@designedresults/m3api-h5-sdk";
import { userApi } from "../api";
import { m3api } from "../../../m3api";


export async function getCurrentUser() {
  const request: M3APIRequest = {
    program: 'GENERAL',
    transaction: 'GetCurrentUser',
  };
  const response = await m3api.execute(request);
  return response?.record;
}


const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query<any, void>({
      queryFn: async () => {
        try {
          const data = await getCurrentUser();
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetCurrentUserQuery } = extendedApi;