import { MIServiceCore, type MIServiceCore as IMIServiceCore } from '@infor-up/m3-odin';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { type IMIRequest, type IMIResponse } from '../';
import { IUserContextState, IUserOutputMedia } from '../features/userContextSlice';

export class MIService {
  private mi: IMIServiceCore;
  constructor(mi?: IMIServiceCore) {
    this.mi = mi ?? new MIServiceCore();
  }

  public async execute(request: IMIRequest, cfg?: MIErrorCfg) {
    let response: IMIResponse;
    try {
      if (request.maxReturnedRecords === undefined) {
        request.maxReturnedRecords = 0;
      }
      response = await lastValueFrom(this.mi.execute(request));
    } catch (error) {
      if (!(error instanceof Error)) {
        response = error as IMIResponse;
        const errorCode = (response.errorCode as string) ?? '';
        const errorMessage = (response.errorMessage as string) ?? '';
        if (errorCode && cfg) {
          const errorType = cfg[errorCode];
          if (errorType) {
            throw new errorType(response);
          }
        } else if (errorMessage.includes('does not exist')) {
          throw new RecordDoesNotExistError(response);
        } else if (errorMessage.includes('already exists')) {
          throw new RecordDoesNotExistError(response);
        } else {
          throw new MIError(response, request);
        }
      } else {
        throw error;
      }
    }
    return response;
  }

  public async exportMI<T>(query: string, options?: ExportMIOptions<T>) {
    const record = {
      QERY: query,
      HDRS: '1',
      SEPC: '|',
    };
    let results: T[] = [];
    const request: IMIRequest = {
      program: 'EXPORTMI',
      transaction: 'Select',
      company: options?.company,
      record,
      maxReturnedRecords: options?.maxReturnedRecords !== undefined ? options.maxReturnedRecords : 0,
    };
    const response = await this.execute(request);

    let items = response?.items ?? [];
    let headers: string[] = [];

    for (let i = 0; i < items.length; i++) {
      let item = items[i].REPL;
      let fields = item.split('|');
      if (i === 0) {
        headers = fields;
      } else {
        let result: any = {};
        for (let j = 0; j < fields.length; j++) {
          let field = headers[j];
          if (options?.getField) {
            field = options.getField(field);
          }

          let value = fields[j];
          if (options?.getValue) {
            value = options.getValue({ value, field });
          }

          result[field] = value;
        }
        if (options?.getId) {
          result['id'] = options.getId(result, i);
        }
        results.push(result);
      }
    }
    return results;
  }

  public async getUserContext(): Promise<IUserContextState> {
    const [userInfo, currentUser, roles] = await Promise.all([
      this.getUserInfo(),
      this.getCurrentUser(),
      this.getRoles(),
    ]);
    const userId = userInfo.ZZUSID;

    const [defaultCompany, defaultDivision, defaultFacility, defaultWarehouse, currentPrinter] = await Promise.all([
      this.getCompany(userInfo.ZDCONO),
      this.getDivision(userInfo.ZDCONO, userInfo.ZDDIVI),
      this.getFacility(userInfo.ZDFACI),
      this.getWarehouse(userInfo.ZZWHLO),
      this.getPrinter(userId),
    ]);
    this.updateMIUserContext(userInfo.ZDCONO, userInfo.ZDDIVI);

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

  public updateMIUserContext(company: string, division: string) {
    this.mi.updateUserContext(company, division);
  }

  public async getUserInfo() {
    const request: IMIRequest = {
      program: 'GENERAL',
      transaction: 'GetUserInfo',
    };
    const response = await this.execute(request);
    if (response.item) {
      return response.item;
    }
  }

  public async getCurrentUser() {
    const request: IMIRequest = {
      program: 'GENERAL',
      transaction: 'GetCurrentUser',
    };
    const response = await this.execute(request);
    return response?.item;
  }

  public async getRoles() {
    let roles: string[]
    const resp = await this.execute({
      program: 'MNS410MI',
      transaction: 'LstRoles',
    });
    roles = resp?.items?.map(item => item.ROLL) ?? [];
    return roles
  }

  public async getPrinter(userId: string, printerFile?: string) {
    const resp = await this.execute({
      program: 'MNS205MI',
      transaction: 'Lst',
      record: {
        USID: userId,
        MEDC: '*PRT',
        PRTF: printerFile,
      },
      outputFields: ['DIVI', 'MEDC', 'DEV1', 'SEQN', 'DEVD', 'PRTF'],
    });
    const outputMedias =
      resp?.items?.map(item => {
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

  protected async getCompany(company: string) {
    const resp = await this.execute({
      program: 'MNS095MI',
      transaction: 'Get',
      record: {
        CONO: company,
      },
      outputFields: ['TX40'],
    });
    return resp?.item;
  }
  protected async getDivision(company: string, division: string) {
    const resp = await this.execute({
      program: 'MNS100MI',
      transaction: 'GetBasicData',
      record: {
        CONO: company,
        DIVI: division,
      },
      outputFields: ['CONM'],
    });
    return resp?.item;
  }
  protected async getFacility(facility: string) {
    const resp = await this.execute({
      program: 'CRS008MI',
      transaction: 'Get',
      record: {
        FACI: facility,
      },
      outputFields: ['FACN'],
    });
    return resp?.item;
  }
  protected async getWarehouse(warehouse: string) {
    const resp = await this.execute({
      program: 'MMS005MI',
      transaction: 'GetWarehouse',
      record: {
        WHLO: warehouse,
      },
      outputFields: ['WHNM'],
    });
    return resp?.item;
  }
}

export type ExportMIOptions<T> = {
  company?: string;
  getField?: (header: string) => string;
  getValue?: (params: { value: any; field: string }) => any;
  getId?: (row: T, index: number) => string | number;
  maxReturnedRecords?: number;
};

export type MIErrorCfg = {
  [key: string]: typeof MIError;
};

export class MIError extends Error {
  errorCode?: string;
  errorMessage?: string;
  program?: string;
  transaction?: string;
  errorField?: string;
  errorType?: string;
  record?: any;


  constructor(public response: IMIResponse, public request?: IMIRequest) {
    super(response.errorMessage);
    this.name = 'MIError';
    this.errorCode = response.errorCode;
    this.errorMessage = response.errorMessage;
    this.program = response.program;
    this.transaction = response.transaction;
    this.errorField = response.errorField;
    this.errorType = response.errorType;
    this.record = request?.record
  }
}

export class RecordDoesNotExistError extends MIError {}
export class RecordAlreadyExistsError extends MIError {}
