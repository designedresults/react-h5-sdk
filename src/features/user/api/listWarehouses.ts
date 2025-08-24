import { m3api } from "@/m3api";
import { userApi } from "../api";
import { Warehouse } from "./getWarehouse";

export type ListWarehousesArgs = {
  facility: string
}

export async function listWarehouses({ facility }: ListWarehousesArgs) {
  const resp = await m3api.execute({
    program: 'MMS005MI',
    transaction: 'LstWarehouses',
    selectedColumns: ['WHLO', 'WHNM', 'FACI'],
  });
  const mainWarehouse = await getMainWarehouse(facility)
  const warehouses: Warehouse[] = resp?.records
    ?.filter(item => item.FACI === facility)
    .map(item => ({
      id: item.WHLO as string,
      label: `${item.WHLO} - ${item.WHNM}`,
      isMain: item.WHLO === mainWarehouse,
      warehouse: item.WHLO as string,
      warehouseName: item.WHNM as string,
    }));
  return warehouses;
}

async function getMainWarehouse(facility: string) {
  const resp = await m3api.execute({
    program: 'CRS008MI',
    transaction: 'Get',
    record: {
      FACI: facility,
    },
    selectedColumns: ['WHLO'],
  });
  return resp.record?.WHLO
}


const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    listWarehouses: build.query<Warehouse[], ListWarehousesArgs>({
      queryFn: async (args) => {
        try {
          if (!args.facility) {
            throw new Error("Facility is required.")
          }
          const data = await listWarehouses(args);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useListWarehousesQuery } = extendedApi;