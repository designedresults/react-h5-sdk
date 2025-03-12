import {
  type MIServiceCore as IMIServiceCore,
  type IMIService,
  type IMIRequest,
  type IMIResponse,
  type IHttpService,
  type IHttpRequest,
  type IHttpResponse,
} from '@infor-up/m3-odin';
import { MIService } from './MIService';

export { IMIService, IMIServiceCore, IMIRequest, IMIResponse, IHttpService, IHttpRequest, IHttpResponse };

export { BulkMI, type IBulkMIRequest, type IBulkMIResponse } from './BulkMI';

export { RecordAlreadyExistsError, RecordDoesNotExistError, MIErrorCfg, MIService } from './MIService';


export const configureMI = (mi?: IMIServiceCore) => {
  return new MIService(mi)
}
