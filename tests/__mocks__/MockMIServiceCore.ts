import { AsyncSubject, Observable } from 'rxjs';
import { IHttpService, IMIRequest, IMIResponse, IMIService } from '../../src/mi';

export default class MockMIServiceCore implements IMIService {
  

  constructor(http?: IHttpService) {
    if (http) {
      this.http = http
    }
  }
  private http?: IHttpService;

  static baseUrl: string;

  static isIonApi: boolean;
  private csrfToken: any;
  private csrfTimestamp: any;
  private csrfStatus: any;
  private readonly maxTokenAge: any;
  private currentCompany: any;
  private currentDivision: any;
  private createRequest: any;
  private isTokenValid: any;
  private useToken: any;
  private executeRefreshToken: any;
  private executeHttp: any;
  private resolve: any;
  private reject: any;
  private getLogInfo: any;
  private logPrefix: any;
  private logDebug: any;
  private logInfo: any;
  private logWarning: any;
  private logError: any;
  private hasError: any;
  private isDebug: any;
  
  execute(request: IMIRequest): Observable<IMIResponse> {
    return new Observable()
  };
  
  updateUserContext(company: string, division: string) {};
  
  getDefaultBaseUrl(): string {
    return ''
  };
  
  getCsrfUrl(baseUrl: string): string {
    return ''
  };
  
  createUrl(baseUrl: string, request: IMIRequest): string {
    return ''
  };
  executeInternal(request: IMIRequest, subject: AsyncSubject<IMIResponse>): void {
    
  };
  private getBaseUrl: any;
  private parseMessage: any;
  
  parseResponse(request: IMIRequest, content: any): IMIResponse {
    return {
      hasError: () => false,
      metadata: {}
    }
  };
  private getTypedValue: any;
  private parseValue: any;
  private getMetadata: any;
  
}
