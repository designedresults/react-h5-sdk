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
import { BulkMIService } from './BulkMIService';
import { CSRF } from './CSRF';

export { IMIService, IMIServiceCore, IMIRequest, IMIResponse, IHttpService, IHttpRequest, IHttpResponse };

export { BulkMIService, type IBulkMIRequest, type IBulkMIResponse } from './BulkMIService';

export { RecordAlreadyExistsError, RecordDoesNotExistError, MIErrorCfg, MIService } from './MIService';


export const configureMI = (mi?: IMIServiceCore) => {
  return new MIService(mi)
}

export const configureBulkMI = () => {
  return new BulkMIService(new CSRF())
}