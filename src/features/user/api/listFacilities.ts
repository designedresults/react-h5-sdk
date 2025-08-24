import { m3api } from "../../../m3api";
import { userApi } from "../api";

export async function listFacilities() {
  const resp = await m3api.execute({
    program: 'CRS008MI',
    transaction: 'ListFacility',
    selectedColumns: ['FACI', 'FACN'],
  });
  const facilities = resp?.records?.map(item => ({
    id: item.FACI,
    label: `${item.FACI} - ${item.FACN}`,
  }));
  return facilities;
}


const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    listFacilities: build.query<any, void>({
      queryFn: async () => {
        try {
          const data = await listFacilities();
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useListFacilitiesQuery } = extendedApi;