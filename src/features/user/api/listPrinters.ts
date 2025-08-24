import { m3api } from "@/m3api";
import { userApi } from "../api";

export async function listPrinters() {
  const resp = await m3api.execute({
    program: 'CRS290MI',
    transaction: 'LstPrinters',
    selectedColumns: ['DEV', 'TX40', 'FACI'],
  });
  const printers = resp?.records?.map(item => ({
    id: item.DEV,
    label: `${item.DEV} - ${item.TX40}`,
  }));
  return printers;
}


const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    listPrinters: build.query<any, void>({
      queryFn: async () => {
        try {
          const data = await listPrinters();
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useListPrintersQuery } = extendedApi;