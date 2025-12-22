import { Injectable } from '@angular/core';
import { AlertService, MessageSeverity } from './alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private alertService: AlertService,
    private router: Router,
  ) {}

  handleError(error: HttpErrorResponse) {
    this.alertService.stopLoadingMessage();
    const isblob = error.error instanceof Blob;
    if (isblob) {
      const blob = error.error as Blob;
      blob.text().then((p) => {
        this.alertService.showMessage(
          'Error Occurred',
          JSON.parse(p).message,
          MessageSeverity.error,
        );
      });
      return;
    }
    if (error.status >= 500 || error.status === 401) {
      if (!error.error || !error.error.exception) {
        this.alertService.showMessage(
          'Error Occurred',
          'An error occurred while performing operation',
          MessageSeverity.error,
        );
      } else {
        this.alertService.showMessage(
          'Error Occurred',
          error.error.exception,
          MessageSeverity.error,
        );
      }
    } else if (error.status === 0) {
      this.alertService.showMessage(
        'Error Occurred',
        'An error occurred while performing operation',
        MessageSeverity.error,
      );
    }
    if (error.error && error.error.message) {
      this.alertService.showStickyMessage(
        'Error',
        error.error.message,
        MessageSeverity.error,
      );
      if (error.error.errors && error.error.errors.length > 0) {
        error.error.errors.forEach((m: string) => {
          this.alertService.showStickyMessage(
            'Error',
            m,
            MessageSeverity.error,
          );
        });
      }
    } else if (
      error.error &&
      error.error.errors &&
      error.error.errors.length > 0
    ) {
      error.error.errors.forEach((m: string) => {
        this.alertService.showStickyMessage('Error', m, MessageSeverity.error);
      });
    } else if (
      error.error &&
      error.error.error &&
      error.error.error_description
    ) {
      console.log('Here');
      this.alertService.showStickyMessage(
        error.error.error,
        error.error.error_description,
        MessageSeverity.error,
      );
    }
  }

  handleSessionExpired() {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage(
      'Error',
      'Your session has expired.\n\rPlease login again.\r\nThank you',
      MessageSeverity.error,
    );
    setTimeout(() => {
      this.router.navigateByUrl('/logout');
    }, 1000);
  }
}
