import { IHttpRequest, IHttpResponse, IHttpService } from '@infor-up/m3-odin';
import { Observable } from "rxjs";
import supertest from 'supertest';
import TestAgent from "supertest/lib/agent";
export default class ProxyHttpService implements IHttpService {
  private supertest: TestAgent;
  constructor(private baseUrl: string) {
    this.supertest = supertest(this.baseUrl);
  }

  execute(request: IHttpRequest): Observable<IHttpResponse> {
    return new Observable(subscriber => {
      this.supertest.get(request.url).then(response => {
        const httpResponse: IHttpResponse = {
          status: response.status,
          statusText: response.status.toString(),
          ok: response.ok,
          url: request.url,
          body: response.body,
        };
        subscriber.next(httpResponse);
        subscriber.complete();
      });
    });
  }
}
