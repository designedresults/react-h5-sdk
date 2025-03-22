import { M3API, M3APIRequest } from "@designedresults/m3api-h5-sdk";
import { IUserContextState, IUserOutputMedia } from "../../features";

  export async function getUserContext(m3api:M3API): Promise<IUserContextState> {
    const [userInfo, currentUser, roles] = await Promise.all([
      getUserInfo(m3api,),
      getCurrentUser(m3api,),
      getRoles(m3api,),
    ]);
    const userId = userInfo.ZZUSID;

    const [defaultCompany, defaultDivision, defaultFacility, defaultWarehouse, currentPrinter] = await Promise.all([
      getCompany(m3api, userInfo.ZDCONO),
      getDivision(m3api,userInfo.ZDCONO, userInfo.ZDDIVI),
      getFacility(m3api,userInfo.ZDFACI),
      getWarehouse(m3api,userInfo.ZZWHLO),
      getPrinter(m3api,userId),
    ]);
    

    const userContext: IUserContextState = {
      userId,
      userName: userInfo.USFN,
      principleUser: currentUser.PRUS,
      environment: currentUser.TEID?.split('_')?.at(1),
      tenantId: currentUser.TEID,
      company: userInfo.ZDCONO,
      companyName: defaultCompany.TX40,
      division: userInfo.ZDDIVI,
      divisionName: defaultDivision.CONM,
      facility: userInfo.ZDFACI,
      facilityName: defaultFacility.FACN,
      warehouse: userInfo.ZZWHLO,
      warehouseName: defaultWarehouse.WHNM,
      printer: currentPrinter,
      roles: roles,
    };
    return userContext;
  }



  export async function getUserInfo(m3api: M3API) {
    const request: M3APIRequest = {
      program: 'GENERAL',
      transaction: 'GetUserInfo',
    };
    const response = await m3api.execute(request);
    if (response.record) {
      return response.record;
    }
  }

  export async function getCurrentUser(m3api: M3API) {
    const request: M3APIRequest = {
      program: 'GENERAL',
      transaction: 'GetCurrentUser',
    };
    const response = await m3api.execute(request);
    return response?.record;
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

  export async function getPrinter(m3api:M3API, userId: string, printerFile?: string) {
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

  export async function getCompany(m3api:M3API, company: string) {
    const resp = await m3api.execute({
      program: 'MNS095MI',
      transaction: 'Get',
      record: {
        CONO: company,
      },
      selectedColumns: ['TX40'],
    });
    return resp?.record;
  }
  export async function getDivision(m3api:M3API, company: string, division: string) {
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
  }
  export async function getFacility(m3api:M3API, facility: string) {
    const resp = await m3api.execute({
      program: 'CRS008MI',
      transaction: 'Get',
      record: {
        FACI: facility,
      },
      selectedColumns: ['FACN'],
    });
    return resp?.record;
  }
  export async function getWarehouse(m3api:M3API, warehouse: string) {
    const resp = await m3api.execute({
      program: 'MMS005MI',
      transaction: 'GetWarehouse',
      record: {
        WHLO: warehouse,
      },
      selectedColumns: ['WHNM'],
    });
    return resp?.record;
  }