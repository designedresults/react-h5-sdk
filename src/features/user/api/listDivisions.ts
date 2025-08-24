import { m3api } from "../../../m3api";
import { userApi } from "../api";

export type ListDivisionsArgs = {
  userId: string,
  company: string
}

export async function listDivisions({ userId, company }: ListDivisionsArgs) {
  const response = await m3api.execute({
    program: 'MNS150MI',
    transaction: 'LstCmpDivi',
    record: {
      USID: userId,
    },
  });

  const divisions = response.records
    ?.filter((item: any) => item.CONO === company)
    .map(item => ({
      id: item.DIVI === '' ? 'BLANK' : item.DIVI,
      label: `${item.DIVI === '' ? 'BLANK' : item.DIVI} - ${item.TX40}`,
    }));

  return divisions;
}

const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    listDivisions: build.query<any, ListDivisionsArgs>({
      queryFn: async (args) => {
        try {
          if (!args.userId) {
            throw new Error("UserId is required.")
          }
          if (!args.company) {
            throw new Error("Company is required.")
          }
          const data = await listDivisions(args);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useListDivisionsQuery } = extendedApi;