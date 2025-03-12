
import { Observable } from 'rxjs';
import { IHttpRequest, IHttpResponse, IHttpService } from '../../src/mi/MIService';

export default class MockHttpService implements IHttpService {
  execute(request: IHttpRequest): Observable<IHttpResponse> {
    return new Observable(subscriber => {
      const response = this.getResponse(request);
      subscriber.next(response);
      subscriber.complete();
    });
  }

  private getResponse(request: IHttpRequest): IHttpResponse {
    return {
      status: 404,
      statusText: 'Not Found',
      ok: false,
      url: request.url,
      body: 'Mock response not found',
    };
  }
}
