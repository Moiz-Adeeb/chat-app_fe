import { Injectable } from '@angular/core';
import { LoginEndpointService } from './login-endpoint.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {UserLogin} from '../models/user-login.model';
import {LoginResponse} from '../models/login-response';
import {ChangePassword} from '../models/change-password';
import {ResponseModel} from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected loginEndpoint: LoginEndpointService) {}

  login(userLogin: UserLogin): Observable<LoginResponse> {
    return this.loginEndpoint.getLoginEndpoint(userLogin);
  }
  refreshToken(token: string): Observable<LoginResponse> {
    return this.loginEndpoint.getRefreshLoginEndpoint<LoginResponse>(token);
  }

  changePassword(changePassword: ChangePassword) {
    return this.loginEndpoint
      .getChangePasswordEndpoint(changePassword)
      .pipe(map((response) => <ResponseModel>response));
  }
}
