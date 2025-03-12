import { Observable } from 'rxjs';
import {
  IMIRequest,
  IMIResponse,
  MIErrorCfg,
  MIService,
  RecordAlreadyExistsError,
  RecordDoesNotExistError
} from '../src/mi';
import MockHttpService from './__mocks__/MockHttpService';
import MockMIServiceCore from './__mocks__/MockMIServiceCore';
jest.mock('../src/mi/MIService');

const obs = (item?: any | any[], error = false) => {
  return new Observable<IMIResponse>(subscriber => {
    if (!item) {
      error = true
    }
    const items = Array.isArray(item) ? item : [item]
    subscriber.next({
      metadata: {},
      hasError: () => error,
      item: items[0],
      items,
    })
    subscriber.complete();
  })
}

describe('mi', () => {
  it('should execute a mocked MIService', async () => {
    const mockHttpService = new MockHttpService()
    const mockMIServiceCore = new MockMIServiceCore(mockHttpService)
    jest.spyOn(mockMIServiceCore, 'execute').mockReturnValue(obs({DATE: '00'}))
    //@ts-ignore
    const mi = new MIService(mockMIServiceCore);
    // jest.spyOn(mi, 'execute').mockResolvedValueOnce({
    //   hasError: () => false,
    //   metadata: {},
    //   item: {DATE: '19991231', TIME: '235959'}
    // })
    const request: IMIRequest = {
      program: 'GENERAL',
      transaction: 'GetServerTime',
    };
    const cfg: MIErrorCfg = {
      XRE0103: RecordDoesNotExistError,
      XRE0104: RecordAlreadyExistsError,
    };
    const resp = await mi.execute(request, cfg);
    expect(resp?.item).toEqual({DATE: '19991231', TIME: '235959'});
  });

  it('should throw a custom error type', async () => {
    const mi = new MIService();
    jest.spyOn(mi, 'execute').mockRejectedValueOnce({
      hasError: () => false,
      metadata: {},
      errorCode: "XRE0103",
      errorMessage: "Record does not exist"
    })
    const request: IMIRequest = {
      program: 'GENERAL',
      transaction: 'ListRecords',
    };
    const cfg: MIErrorCfg = {
      XRE0103: RecordDoesNotExistError,
    };
    expect(async () => {
      await mi.execute(request, cfg);
    }).rejects.toThrow(RecordDoesNotExistError)
    
  });

  // it('should use the proxy http service', async () => {
  //   const httpService = new ProxyHttpService("http://localhost:3001");
  //   const miServiceCore = new MIServiceCore(httpService)
  //   const miService = new MIService(miServiceCore);
  //   const request: IMIRequest = {
  //     program: 'GENERAL',
  //     transaction: 'GetServerTime',
  //   };
  //   const cfg: MIErrorCfg = {
  //     XRE0103: RecordDoesNotExistError,
  //     XRE0104: RecordAlreadyExistsError,
  //   };
  //   const resp = await miService.execute(request, cfg);
  // });

  // it('should get an item', async () => {
  //   const httpService = new ProxyHttpService("http://localhost:3001");
  //   const miServiceCore = new MIServiceCore(httpService)
  //   const miService = new MIService(miServiceCore);

  //   const itemNumber = "71117.00155"
  //   const request: IMIRequest = {
  //     program: 'MMS200MI',
  //     transaction: 'GetItmBasic',
  //     record: {
  //       ITNO: itemNumber
  //     }
  //   };

  //   const resp = await miService.execute(request);
  //   expect(resp.item.ITNO).toEqual(itemNumber);
  // });

  // it('should throw a does not exist error', async () => {
  //   const httpService = new ProxyHttpService("http://localhost:3001");
  //   const miServiceCore = new MIServiceCore(httpService)
  //   const miService = new MIService(miServiceCore);

  //   const itemNumber = "71117.00155X"
  //   const request: IMIRequest = {
  //     program: 'MMS200MI',
  //     transaction: 'GetItmBasic',
  //     record: {
  //       ITNO: itemNumber
  //     }
  //   };
  //   const cfg: MIErrorCfg = {
  //     WIT0103: RecordDoesNotExistError,
  //   };
  //   expect(async () => {
  //     await miService.execute(request, cfg);
  //   }).toThrowError(RecordDoesNotExistError);

  // });

  // it('should get an EXPORTMI', async () => {
  //   const httpService = new ProxyHttpService("http://localhost:3001");
  //   const miServiceCore = new MIServiceCore(httpService)
  //   const miService = new MIService(miServiceCore);

  //   const query = "MMCONO, MMITNO, MMITDS from MITMAS"
  //   interface IItem {
  //     company: string,
  //     itemNumber: string,
  //     itemDescription: string
  //   }
  //   const fieldMap: any = {
  //     MMCONO: "company",
  //     MMITNO: "itemNumber",
  //     MMITDS: "itemDescription"
  //   }
  //   const options: ExportMIOptions<IItem> = {
  //     maxReturnedRecords: 2,
  //     getField: (header) => fieldMap[header] ?? header,
  //     getId: (row) => row.company + "-" + row.itemNumber
  //   }
  //   const items = await miService.exportMI<IItem>(query, options)
  //   expect(items.length).toBe(2);

  // });
});
