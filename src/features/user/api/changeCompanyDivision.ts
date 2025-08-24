import { m3api } from "@/m3api";
import { userApi } from "../api";
import { getUserContext } from "./getUserContext";

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
    changeCompanyDivision: build.mutation<void, ChangeCompanyDivisionArgs>({
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
          await new Promise(r => setTimeout(r, 1500))
          await changeCompanyDivision(args)

        } catch (error) {
          return { error }
        }

        return { data: undefined };
      },
    }),
  }),
});

export const { useChangeCompanyDivisionMutation } = extendedApi;