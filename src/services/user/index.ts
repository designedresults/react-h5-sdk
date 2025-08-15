import { M3API, M3APIRequest } from "@designedresults/m3api-h5-sdk";
import { IUserContextState, IUserOutputMedia } from "../../features";

export async function getUserContext(m3api: M3API, userId: string | null): Promise<IUserContextState> {
  const currentUser = await getCurrentUser(m3api);
  let impersonator = null;
  if (userId === null) {
    // no userId provided, use current auth user
    userId = currentUser.USER as string;
  } else {
    // impersonation userId provided, keep current auth user as impersonator
    impersonator = currentUser.USER as string;
  }


  const userInfo = await getUserData(m3api, userId)

  const userName = userInfo.NAME
  const company = userInfo.CONO
  const division = userInfo.DIVI
  const facility = userInfo.FACI
  const warehouse = userInfo.WHLO

  const [roles, defaultCompany, defaultDivision, defaultFacility, defaultWarehouse, printer] = await Promise.all([
    getRoles(m3api),
    getCompany(m3api, company),
    getDivision(m3api, company, division),
    getFacility(m3api, facility),
    getWarehouse(m3api, warehouse),
    getPrinter(m3api, userId),
  ]);


  const userContext: IUserContextState = {
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
    warehouseName: defaultWarehouse?.WHNM,
    printer,
    roles,
    impersonator
  };
  return userContext;
}

export async function getCurrentUser(m3api: M3API) {
  const request: M3APIRequest = {
    program: 'GENERAL',
    transaction: 'GetCurrentUser',
  };
  const response = await m3api.execute(request);
  return response?.record;
}

export async function getUserData(m3api: M3API, userId: string) {
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

export async function getRoles(m3api: M3API) {
  let roles: string[]
  const resp = await m3api.execute({
    program: 'MNS410MI',
    transaction: 'LstRoles',
  });
  roles = resp?.records?.map(item => item.ROLL) ?? [];
  return roles
}

export async function getPrinter(m3api: M3API, userId: string, printerFile?: string) {
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

export async function getCompany(m3api: M3API, company: string) {
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
export async function getDivision(m3api: M3API, company: string, division: string) {
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
export async function getFacility(m3api: M3API, facility: string) {
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
export async function getWarehouse(m3api: M3API, warehouse: string) {

  try {
    const resp = await m3api.execute({
      program: 'MMS005MI',
      transaction: 'GetWarehouse',
      record: {
        WHLO: warehouse,
      },
      selectedColumns: ['WHNM'],
    });
    return resp?.record;
  } catch (error) {
    console.error(error)
  }
}