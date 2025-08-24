import { userApi } from "../api";
import { UserContext } from "../slice";
import { getCompany } from "./getCompany";
import { getCurrentUser } from "./getCurrentUser";
import { getDivision } from "./getDivision";
import { getFacility } from "./getFacility";
import { getPrinter } from "./getPrinter";
import { getRoles } from "./getRoles";
import { getUserData } from "./getUserData";
import { getWarehouse } from "./getWarehouse";

export type UserContextArgs = {
  userId: string | null
}
export async function getUserContext(args: UserContextArgs): Promise<UserContext> {
  const currentUser = await getCurrentUser();
  let userId: string
  let impersonator = null;
  if (args.userId === null) {
    // no userId provided, use current auth user
    userId = currentUser.USER as string;
  } else {
    // impersonation userId provided, keep current auth user as impersonator
    userId = args.userId
    impersonator = currentUser.USER as string;
  }


  const userInfo = await getUserData(userId)

  const userName = userInfo.NAME
  const company = userInfo.CONO
  const division = userInfo.DIVI
  const facility = userInfo.FACI
  const warehouse = userInfo.WHLO

  const [roles, defaultCompany, defaultDivision, defaultFacility, defaultWarehouse, printer] = await Promise.all([
    getRoles(userId),
    getCompany(company),
    getDivision(company, division),
    getFacility(facility),
    getWarehouse(warehouse),
    getPrinter(userId),
  ]);


  const userContext: UserContext = {
    userId,
    userName,
    environment: currentUser.TEID?.split('_')?.at(1),
    tenantId: currentUser.TEID,
    company,
    companyName: defaultCompany?.TX40,
    division,
    divisionName: defaultDivision?.CONM,
    facility,
    facilityName: defaultFacility?.FACN,
    warehouse,
    warehouseName: defaultWarehouse?.warehouseName,
    printer,
    roles,
    impersonator
  };
  return userContext;
}



const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    getUserContext: build.query<UserContext, UserContextArgs>({
      queryFn: async (args) => {
        try {
          const data = await getUserContext(args);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    setUserContext: build.mutation<UserContext, UserContextArgs>({
      queryFn: async (args) => {
        try {
          await new Promise(r => setTimeout(r, 1200))
          const data = await getUserContext(args);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),

});

export const { useGetUserContextQuery, useSetUserContextMutation } = extendedApi
export const setUserContextEndpoint = extendedApi.endpoints.setUserContext

export const initUserContext = () => {
  return extendedApi.endpoints.setUserContext.initiate({ userId: null })
}
