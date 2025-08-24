import { m3api } from "@/m3api";

export async function getRoles(userId: string) {
  let roles: string[]
  const resp = await m3api.exportmi<{KUROLL: string}>(`KUROLL from CMNRUS where KUUSID = ${userId}`);
  roles = resp?.map(item => item.KUROLL) ?? [];
  return roles
}