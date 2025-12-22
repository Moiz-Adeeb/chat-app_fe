import { Injectable } from '@angular/core';
import { EndpointFactoryService } from './endpoint-factory.service';
import { map } from 'rxjs/operators';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class PasswordService extends EndpointFactoryService {
  private readonly baseUrl =
    this.configurations.baseUrl + '/api/v1/user/updatePassword';
  private readonly changePasswordUrl =
    this.configurations.baseUrl + '/api/v1/user/changePassword';
  private readonly companyUrl = this.baseUrl + '/company';

  updatePassword(userId: string, password: string, confirmPassword: string) {
    return this.http
      .put(
        this.baseUrl,
        {
          userId,
          password,
          confirmPassword,
        },
        {},
      )
      .pipe(map((response) => <ResponseModel>response));
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    return this.http
      .put(
        this.changePasswordUrl,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {},
      )
      .pipe(map((response) => <ResponseModel>response));
  }

  updatePasswordByCompany(
    userId: string,
    password: string,
    confirmPassword: string,
  ) {
    return this.http
      .put(
        this.companyUrl,
        {
          userId,
          password,
          confirmPassword,
        },
        {},
      )
      .pipe(map((response) => <ResponseModel>response));
  }
}
