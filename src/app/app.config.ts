import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';

import { AuthHttpInterceptor } from './interceptor/auth-http-interceptor';
import { API_BASE_URL } from './api/api';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAngularSvgIcon } from 'angular-svg-icon';
// ✅ No need for factory anymore — v17+ handles it internally if provided correctly

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: API_BASE_URL, useValue: environment.baseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideToastr(),
    provideAngularSvgIcon(),

    // ✅ Add TranslateHttpLoader provider for Angular DI
    provideTranslateHttpLoader(),

    // ✅ Add TranslateModule properly
    importProvidersFrom(
      HttpClientModule,
      ToastrModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        },
      }),
    ),

    provideRouter(routes),
  ],
};
