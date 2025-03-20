export {
  type IMIService,
  type IMIRequest,
  type IMIResponse,
  type IHttpService,
  type IHttpRequest,
  type IHttpResponse,
} from '@infor-up/m3-odin';

export { BulkMIService, type IBulkMIRequest, type IBulkMIResponse } from './BulkMIService';

export { type RecordAlreadyExistsError, type RecordDoesNotExistError, type MIErrorCfg, MIService } from './MIService';

import { type MIServiceCore as IMIServiceCore } from '@infor-up/m3-odin';
export { type IMIServiceCore };
import { MIService } from './MIService';
import { BulkMIService } from './BulkMIService';
import { CSRF } from './CSRF';

export const configureMI = (mi?: IMIServiceCore) => {
  return new MIService(mi);
};

export const configureBulkMI = () => {
  return new BulkMIService(new CSRF());
};
