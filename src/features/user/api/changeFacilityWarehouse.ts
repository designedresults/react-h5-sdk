import { m3api } from "@/m3api";
import { userApi } from "../api";
import { getUserContext } from "./getUserContext";
import { UserContext } from "../slice";

export type ChangeFacilityWarehouseArgs = {
  userId: string,
  company: string,
  division: string,
  facility: string,
  warehouse: string
}
async function changeFacilityWarehouse({ userId, company, division, facility, warehouse }: ChangeFacilityWarehouseArgs) {
  await m3api.execute({
    program: 'MNS150MI',
    transaction: 'ChgDefaultValue',
    record: {
      USID: userId,
      CONO: company,
      DIVI: division,
      FACI: facility,
      WHLO: warehouse,
    },
  });
}

const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    changeFacilityWarehouse: build.mutation<UserContext, ChangeFacilityWarehouseArgs>({
      queryFn: async (args) => {
        try {
          if (!args.userId) {
            throw new Error("UserId is required.")
          }
          if (!args.company) {
            throw new Error("Company is required.")
          }
          if (!args.division) {
            throw new Error("Division is required.")
          }
          if (!args.facility) {
            throw new Error("Facility is required.")
          }
          if (!args.warehouse) {
            throw new Error("Warehouse is required.")
          }

          await changeFacilityWarehouse(args)
          const userContext = await getUserContext({userId: args.userId})
          return { data: userContext };

        } catch (error) {
          return { error }
        }
      },
    }),
  }),
});

export const { useChangeFacilityWarehouseMutation } = extendedApi;
export const changeFacilityWarehouseEndpoint = extendedApi.endpoints.changeFacilityWarehouse