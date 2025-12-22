import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ResponseErrorModel } from '../models/response-error-model';
import { EndpointFactoryService } from '../services/endpoint-factory.service';
import {LoginService} from '../services/login.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private loginService: LoginService,
    private errorHandler: ErrorHandlerService,
    private endpointFactoryService: EndpointFactoryService,
    private authService: AuthService,
    private translate: TranslateService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (
      req.headers.get('Authorization') === null &&
      req.headers.get('Content-Type') === null
    ) {
      const headers = this.endpointFactoryService.getRequestHeaders().headers;
      req = req.clone({ headers });
    }
    else if (req.headers.get('Authorization') == null) {
      const headers = this.endpointFactoryService.getRequestHeaders().headers;
      const newHeader = req.headers.set(
        'Authorization',
        headers.get('Authorization') ?? [],
      ).set(
        'TimeZone',
        headers.get('TimeZone') as string,
      )
        .set('Language', this.authService.currentLanguage);
      req = req.clone({ headers: newHeader });
    }
    // console.log(req.headers);
    // if (!window.navigator.onLine) {
    //   return throwError(
    //     // in place of clone:
    //     new HttpErrorResponse({
    //       error: this.CustomNotOnlineResponse(),
    //     }),
    //   );
    // }
    if (this.authService.isLoggedIn) {
      if (this.authService.isSessionExpired && !this.isRefreshing) {
        this.alertService.startLoadingMessage(this.translate.instant('RefreshingSession'));
        this.isRefreshing = true;
        return this.loginService
          .refreshToken(this.authService.refreshToken)
          .pipe(
            mergeMap((data) => {
              this.isRefreshing = false;
              this.authService.processRefreshToken(data);
              const clonedRequest = req.clone({
                headers: new HttpHeaders({
                  Authorization: 'Bearer ' + this.authService.accessToken,
                  'Content-Type': 'application/json',
                  'Language': this.authService.currentLanguage,
                }),
              });
              return next
                .handle(clonedRequest)
                .pipe(
                  map((event) => {
                    if (event instanceof HttpResponse) {
                      if (event.body && event.body.message) {
                        event = event.clone({
                          body: this.resolveError(event.body),
                        });
                      }
                      if (event.body && event.body.success === false) {
                        throw new HttpErrorResponse({
                          status: 400,
                          error: event.body,
                        });
                      }
                    }
                    return event;
                  }),
                )
                .pipe(
                  catchError((error: HttpErrorResponse) => {
                    this.errorHandler.handleError(error);
                    return throwError(() => error);
                  }),
                );
            }),
            catchError((err) => {
              this.isRefreshing = false;
              this.authService.logout();
              this.errorHandler.handleError(err);
              return from([]);
            }),
          );
      }
    }
    return next
      .handle(req)
      .pipe(
        map((event) => {
          if (event instanceof HttpResponse) {
            if (event.body && event.body.message) {
              event = event.clone({ body: this.resolveError(event.body) });
            }
            if (event.body && event.body.success === false) {
              throw new HttpErrorResponse({
                status: 400,
                error: event.body,
              });
            }
          }
          return event;
        }),
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandler.handleError(error);
          return throwError(error);
        }),
      );
  }

  CustomMessageResponse(msg: string): ResponseErrorModel {
    const data: ResponseErrorModel = new ResponseErrorModel();
    data.errors = [];
    data.message = msg;
    return data;
  }

  CustomNotOnlineResponse(): ResponseErrorModel {
    const data: ResponseErrorModel = new ResponseErrorModel();
    data.message = 'Token Expired';
    return data;
  }

  private resolveError(body: any): any {
    return {
      response: null,
      success: body.success,
      error: this.CustomMessageResponse(body.message),
    };
  }
}
