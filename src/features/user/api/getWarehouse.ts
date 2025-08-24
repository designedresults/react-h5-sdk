import { m3api } from "../../../m3api";

export type Warehouse = {
  id: string,
  label: string,
  isMain?: boolean,
  warehouse: string,
  warehouseName: string
}

export async function getWarehouse(warehouse: string): Promise<Warehouse> {
  const resp = await m3api.execute({
    program: 'MMS005MI',
    transaction: 'GetWarehouse',
    record: {
      WHLO: warehouse,
    },
    selectedColumns: ['WHNM'],
  });

  return {
    id: warehouse,
    label: `${warehouse} - ${resp.record?.WHNM}`,
    warehouse,
    warehouseName: resp.record?.WHNM
  };
}