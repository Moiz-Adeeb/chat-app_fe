import {
  HttpClient,
  HttpHeaders,
  HttpParameterCodec,
  HttpParams,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleNames } from '../constants/role-names';
import { KeyValue } from '../models/key-value';
import { LoginResponse } from '../models/login-response';
import { ResponseModel } from '../models/response.model';
import { UserLogin } from '../models/user-login.model';
import { ConfigurationService } from './configuration.service';
import { Dbkey } from './db-key';
import { EncoderService } from './encoder.service';
import { LocalStoreManager } from './local-store-manager.service';

@Injectable({
  providedIn: 'root',
})
export class EndpointFactoryService {
  protected host = '';
  private taskPauser?: Subject<any>;
  private isRefreshingLogin?: boolean;
  private readonly _loginUrl: string = '/connect/token';
  private readonly _verifyloginUrl: string = '/api/v1/login/verify';

  constructor(
    protected http: HttpClient,
    protected configurations: ConfigurationService,
    private injector: Injector,
    protected encoderService: EncoderService,
    private localStorage: LocalStoreManager,
  ) {}

  private _accessToken?: string;

  get accessToken(): string {
    return this.localStorage.getData(Dbkey.ACCESS_TOKEN);
  }
  get baseUrl(): string {
    return this.configurations.baseUrl;
  }

  private get loginUrl() {
    return this.configurations.baseUrl + this._loginUrl;
  }

  getLoginEndpoint(userLogin: UserLogin): Observable<LoginResponse> {
    if (ConfigurationService.isUseFakeApi) {
      const r = new LoginResponse();
      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1ODYxNjk3NTEsImV4cCI6MTYxNzcwNTc1MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImZ1bGxOYW1lIjoiSm9obm55IiwiU3VybmFtZSI6IlJvY2tldCIsIkVtYWlsIjoianJvY2tldEBleGFtcGxlLmNvbSIsInJvbGVzIjoiQWRtaW5pc3RyYXRvciIsImltYWdlIjoiL2Fzc2V0cy9pbWcvZGVmYXVsdC11c2VyLnBuZyJ9.eJFCpny67EgxK4CMugAbovCSLYws3lvgdGgc5PeiiP0';
      r.access_token = token;
      r.expires_in = 999999999999;
      r.id_token = token;
      r.token_type = 'Bearer';
      r.refresh_token = token;
      return of(r);
    }
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    // const header = new HttpHeaders({ 'Content-Type': 'application/json' });

    const params = new HttpParams({
      encoder: this.encoderService,
    })
      .append('username', userLogin.userName ?? '')
      .append('password', userLogin.password ?? '')
      .append('provider', userLogin.provider + '')
      .append('token', userLogin.token ?? '')
      .append('role', userLogin.role ?? '')
      .append('grant_type', 'password')
      .append('granttype', 'password')
      .append('scope', 'openid email profile offline_access roles');
    const requestBody = params.toString();
    return this.http.post<LoginResponse>(this.loginUrl, requestBody, {
      headers: header,
    });
  }

  getPaginateRequest(
    url: string,
    page = 1,
    pageSize = 10,
    search = '',
    orderBy = '',
    direction = '',
    others: KeyValue[] = [],
  ): Observable<ResponseModel> {
    let params = new HttpParams({ encoder: new CustomEncoder() })
      .set('page', page + '')
      .set('pageSize', pageSize + '')
      .set('search', search + '')
      .set('isDescending', direction === 'desc' ? 'true' : 'false')
      .set('orderBy', orderBy + '');
    others.forEach((p) => {
      params = params.set(p.key, p.value);
    });
    return this.http
      .get(url, {
        params,
      })
      .pipe(map((response) => response as ResponseModel));
  }

  getRefreshLoginEndpoint<T>(token: string): Observable<any> {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const params = new HttpParams()
      .append('refresh_token', token)
      .append('grant_type', 'refresh_token')
      .append('granttype', 'refresh_token')
      .append('scope', 'openid email profile offline_access roles');
    const requestBody = params.toString();

    return this.http.post<T>(this.loginUrl, requestBody, { headers: header });
  }

  public getRequestHeaders(): { headers: HttpHeaders } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken,
      'Content-Type': 'application/json',
      Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
      'App-Version': '1',
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return { headers };
  }

  public resumeTasks(continueOp: boolean) {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = undefined;
      }
    });
  }

  protected getFormDataRequestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken,
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
      'App-Version': '1',
    });
    return { headers };
  }

  protected getAuthHeader(includeJsonContentType?: boolean): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken,
    });

    if (includeJsonContentType) {
      headers = headers.append('Content-Type', 'application/json');
    }

    headers = headers.append(
      'Accept',
      `application/vnd.iman.v1+json, application/json, text/plain, */*`,
    );
    headers = headers.append('App-Version', ConfigurationService.appVersion);
    return { headers };
  }
}

export class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
