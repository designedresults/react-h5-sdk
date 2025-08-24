import { m3api } from "@/m3api";
import { userApi } from "../api";
import { getUserContext } from "./getUserContext";
import { UserContext } from "../slice";

export type ChangeCompanyDivisionArgs = {
  userId: string,
  company: string,
  division: string
}
async function changeCompanyDivision({ userId, company, division }: ChangeCompanyDivisionArgs) {
  await m3api.execute({
    program: 'MNS150MI',
    transaction: 'ChgDefaultValue',
    record: {
      USID: userId,
      CONO: company,
      DIVI: division,
    },
  });
}

const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    changeCompanyDivision: build.mutation<UserContext, ChangeCompanyDivisionArgs>({
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

          await changeCompanyDivision(args)
          const userContext = await getUserContext({ userId: args.userId })
          return { data: userContext }

        } catch (error) {
          return { error }
        }

        return { data: undefined };
      },
    }),
  }),
});

export const { useChangeCompanyDivisionMutation } = extendedApi;
export const changeCompanyDivisionEndpoint = extendedApi.endpoints.changeCompanyDivision