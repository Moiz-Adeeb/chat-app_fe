import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {EndpointFactoryService} from './endpoint-factory.service';
import {ChangePassword} from '../models/change-password';

@Injectable({
  providedIn: 'root',
})
export class LoginEndpointService extends EndpointFactoryService {
  private readonly _changePassword: string = '/api/v1/user/changePassword';
  get changePasswordUrl() {
    return this.configurations.baseUrl + this._changePassword;
  }

  getChangePasswordEndpoint(changePassword: ChangePassword): Observable<any> {
    const body = {
      currentPassword: changePassword.currentPassword,
      confirmPassword: changePassword.confirmPassword,
      newPassword: changePassword.newPassword,
    };
    return this.http.post(this.changePasswordUrl, body, {
      headers: this.getRequestHeaders().headers,
    });
  }
}
