import { m3api } from "@/m3api";

export async function getCompany(company: string) {
  try {
    const resp = await m3api.execute({
      program: 'MNS095MI',
      transaction: 'Get',
      record: {
        CONO: company,
      },
      selectedColumns: ['TX40'],
    });
    return resp?.record;
  } catch (error) {
    console.error(error)
  }
}