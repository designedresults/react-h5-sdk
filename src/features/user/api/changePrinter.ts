import { m3api } from "../../../m3api";
import { userApi } from "../api";
import { getUserContext } from "./getUserContext";
import { UserContext } from "../slice";

export type ChangePrinterArgs = {
  userId: string,
  division: string,
  printerFile: string,
  device: string,
  sequence: string
}
async function changePrinter({ userId, division, printerFile, device, sequence }: ChangePrinterArgs) {
  await m3api.execute({
    program: 'MNS205MI',
    transaction: 'UpdPrtMedia',
    record: {
      USID: userId,
      DIVI: division,
      PRTF: printerFile,
      DEV: device,
      SEQN: sequence,
    },
  });
}

const extendedApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    changePrinter: build.mutation<UserContext, ChangePrinterArgs>({
      queryFn: async (args) => {
        try {
          if (!args.userId) {
            throw new Error("UserId is required.")
          }
          if (!args.division) {
            throw new Error("Division is required.")
          }
          if (args.printerFile === undefined) {
            throw new Error("PrinterFile is required.")
          }
          if (!args.device) {
            throw new Error("Device is required.")
          }
          if (!args.sequence) {
            throw new Error("Sequence is required.")
          }

          await changePrinter(args)
          const userContext = await getUserContext({ userId: args.userId })
          return { data: userContext }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
});

export const { useChangePrinterMutation } = extendedApi;
export const changePrinterEndpoint = extendedApi.endpoints.changePrinter