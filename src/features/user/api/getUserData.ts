import { m3api } from "../../../m3api";
import { M3APIRequest } from "@designedresults/m3api-h5-sdk";

export async function getUserData(userId: string) {
  const request: M3APIRequest = {
    program: 'MNS150MI',
    transaction: 'GetUserData',
    record: {
      USID: userId
    }
  };
  const response = await m3api.execute(request);
  if (response.record) {
    return response.record;
  }
}