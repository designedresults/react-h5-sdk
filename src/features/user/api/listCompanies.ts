import { m3api } from "../../../m3api";
import { userApi } from "../api";
export type ListCompaniesArgs = {
  userId: string;
}
export async function listCompanies({userId}: ListCompaniesArgs) {
  const response = await m3api.execute({
    program: 'MNS150MI',
    transaction: 'LstCmpDivi',
    record: {
      USID: userId,
    },
  });

  const companies = response.records
    ?.filter((item: any) => item.CONO > '001')
    .reduce((map: Map<string, any>, item: any) => {
      if (!map.has(item.CONO)) {
        map.set(item.CONO, {
          id: item.CONO,
          label: `${item.CONO} - ${item.CONM}`,
        });
      }
      return map;
    }, new Map<string, any>());

  return Array.from(companies?.values() ?? []);
}


const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    listCompanies: build.query<any, ListCompaniesArgs>({
      queryFn: async (args) => {
        try {
          if (!args.userId) {
            throw new Error("UserId is required.")
          }
          const data = await listCompanies(args);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useListCompaniesQuery } = extendedApi;