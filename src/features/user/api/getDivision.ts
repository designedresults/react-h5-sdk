import { m3api } from "@/m3api";

export async function getDivision(company: string, division: string) {
  try {
    const resp = await m3api.execute({
      program: 'MNS100MI',
      transaction: 'GetBasicData',
      record: {
        CONO: company,
        DIVI: division,
      },
      selectedColumns: ['CONM'],
    });
    return resp?.record;
  } catch (error) {
    console.error(error)
  }
}