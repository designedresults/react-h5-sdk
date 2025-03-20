import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';

/**
 * Manages Cross Site Request Forgery (CSRF) tokens used when making interal calls to M3 resources
 */
export class CSRF {
  private csrfToken?: string;

  /**
   * Retrieves a CSRF token from the M3 engine
   *
   * Is is rare that a token will need to be manually retieved and used.  The provided function {@link fetch} handles
   * retrieving and using a the CSRF token to make requests.
   *
   * @returns CSRF token
   *
   * @example
   * ```ts
   * const csrf = new CSRF()
   * const token = await csrf.getToken()
   * ```
   */
  public async getToken() {
    const resp = await axios('/foundation-rest/csrf');
    const token = resp.data;
    return token;
  }

  /**
   * Executes a browser [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) request and automatically provides a valid CSRF token.
   *
   * Additional fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch) can be provided if necesary.
   *
   * @param url
   * @param options
   * @returns fetch response object
   *
   * @example
   * ```ts
   * const csrf = new CSRF()
   * const url = '/m3api-rest/v2/execute/GENERAL/GetUserInfo'
   * const options = {
   *    headers: {
   *      "Content-type": "application/json"
   *    }
   * }
   * const resp = await csrf.fetch(url)
   * const json = await resp.json()
   * ```
   */
  public async fetch(url: string, options: AxiosRequestConfig) {
    if (!this.csrfToken) {
      this.csrfToken = await this.getToken();
    }
    const headers: any = options.headers?.raw ?? {};

    let resp = await axios(url, {
      method: options.method,
      data: options.data,
      headers: {
        'fnd-csrf-token': this.csrfToken,
        Accept: headers['Accept'],
        'Content-Type': headers['Content-Type'],
      },
    });
    if (resp.status == 403) {
      const json = resp.data;
      if (json?.message == 'CSRF_TOKEN_EXPIRED') {
        this.csrfToken = await this.getToken();
        resp = await axios(url, {
          method: options.method,
          data: options.data,
          headers: {
            'fnd-csrf-token': this.csrfToken,
            Accept: headers['Accept'],
            'Content-Type': headers['Content-Type'],
          },
        });
      }
    }

    return resp;
  }

  protected addToken(options: AxiosRequestConfig) {
    if (this.csrfToken) {
      const headers = new AxiosHeaders(options.headers?.raw);
      headers.set('fnd-csrf-token', this.csrfToken);
      options.headers = headers;
    }
  }
}
