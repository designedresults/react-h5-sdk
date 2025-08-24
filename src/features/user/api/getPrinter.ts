import { m3api } from "@/m3api";
import { IUserOutputMedia } from "../slice";

export async function getPrinter(userId: string, printerFile?: string) {
  const resp = await m3api.execute({
    program: 'MNS205MI',
    transaction: 'Lst',
    record: {
      USID: userId,
      MEDC: '*PRT',
      PRTF: printerFile,
    },
    selectedColumns: ['DIVI', 'MEDC', 'DEV1', 'SEQN', 'DEVD', 'PRTF'],
  });
  const outputMedias =
    resp?.records?.map(item => {
      const outputMedia: IUserOutputMedia = {
        division: item.DIVI,
        media: item.MEDC,
        device: item.DEV1,
        sequence: item.SEQN,
        location: item.DEVD,
        printerFile: item.PRTF,
      };
      return outputMedia;
    }) ?? [];
  const blankPrintFile = outputMedias.find(media => media.printerFile === '');
  if (blankPrintFile) {
    return blankPrintFile;
  }
  const putawayLabel = outputMedias.find(media => media.printerFile === 'MWS450PF');
  if (putawayLabel) {
    return putawayLabel;
  }
}