import { m3api } from "@/m3api";

export async function getFacility(facility: string) {
  try {
    const resp = await m3api.execute({
      program: 'CRS008MI',
      transaction: 'Get',
      record: {
        FACI: facility,
      },
      selectedColumns: ['FACN'],
    });
    return resp?.record;
  } catch (error) {
    console.error(error)
  }
}