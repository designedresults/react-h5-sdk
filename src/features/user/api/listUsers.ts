import { m3api } from "@/m3api";
import { userApi } from "../api";

export async function listUsers() {
  const response = await m3api.execute({
    program: 'MNS150MI',
    transaction: 'LstUserData',
    selectedColumns: ['USID', 'TX40']
  });
  const users = response.records.map(rec => ({ id: rec.USID, label: `${rec.USID} - ${rec.TX40}` }))
  return users;
}


const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    ListUsers: build.query<{id: string, label: string}[], void>({
      queryFn: async () => {
        try {
          const data = await listUsers();
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useListUsersQuery } = extendedApi;