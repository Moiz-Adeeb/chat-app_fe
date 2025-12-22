// ====================================================

// ====================================================

import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private messages = new Subject<AlertMessage>();
  private stickyMessages = new Subject<AlertMessage>();
  private dialogs = new Subject<AlertDialog>();
  private _isLoading = false;
  private loadingMessageId: any;

  showDialog(message: string): void;
  showDialog(
    message: string,
    type: DialogType,
    okCallback: (val?: any) => any,
  ): void;
  showDialog(
    message: string,
    type?: DialogType,
    okCallback?: (val?: any) => any | undefined,
    cancelCallback?: () => any | undefined,
    okLabel?: string,
    cancelLabel?: string,
    defaultValue?: string,
  ): void {
    if (!type) {
      type = DialogType.alert;
    }
    if (!cancelCallback) {
      cancelCallback = () => {
        this.closeDialog();
      };
    }

    this.dialogs.next({
      message,
      type,
      okCallback,
      cancelCallback,
      okLabel,
      cancelLabel,
      defaultValue,
    });
  }

  // This is a test method to check height

  showMessage(
    summary: string,
    detail: string,
    severity: MessageSeverity,
  ): void {
    this.showMessageHelper(summary, detail, severity, false);
  }

  showErrorMessage(detail: string): void {
    this.showMessageHelper('Error', detail, MessageSeverity.error, false);
  }

  showWarningMessage(detail: string): void {
    this.showMessageHelper('Warning', detail, MessageSeverity.error, false);
  }

  showSuccessMessage(detail: string): void {
    this.showMessageHelper('Success', detail, MessageSeverity.success, false);
  }

  showStickyMessage(
    summary: string,
    detail: string,
    severity: MessageSeverity,
  ): void {
    if (!severity) {
      severity = MessageSeverity.default;
    }
    this.showMessageHelper(summary, detail, severity, true);
  }

  private showMessageHelper(
    summary: string,
    detail: string,
    severity: MessageSeverity,
    isSticky: boolean,
  ): void {
    if (isSticky) {
      this.stickyMessages.next({severity, summary, detail});
    } else {
      this.messages.next({severity, summary, detail});
    }
  }

  startLoadingMessage(message = 'Processing...', caption = ''): void {
    this._isLoading = true;
    clearTimeout(this.loadingMessageId);

    this.loadingMessageId = setTimeout(() => {
      this.showStickyMessage(caption, message, MessageSeverity.wait);
    }, 1000);
  }

  stopLoadingMessage(): void {
    this._isLoading = false;
    clearTimeout(this.loadingMessageId);
    this.resetStickyMessage();
  }

  closeDialog(): void {
    this.dialogs.next({
      message: '',
      type: DialogType.close,
    });
  }

  resetStickyMessage(): void {
    this.stickyMessages.next({
      severity: MessageSeverity.close,
    });
  }

  getDialogEvent(): Observable<AlertDialog> {
    return this.dialogs.asObservable();
  }

  getMessageEvent(): Observable<AlertMessage> {
    return this.messages.asObservable();
  }

  getStickyMessageEvent(): Observable<AlertMessage> {
    return this.stickyMessages.asObservable();
  }

  get isLoadingInProgress(): boolean {
    return this._isLoading;
  }
}

// ******************** Dialog ********************//
export class AlertDialog {
  constructor(
    message: string,
    type: DialogType,
    okCallback?: (val?: any) => any,
    cancelCallback?: () => any,
    defaultValue?: string,
    okLabel?: string,
    cancelLabel?: string,
  ) {
    this.message = message;
    this.type = type;
    this.okCallback = okCallback;
    this.cancelCallback = cancelCallback;
    this.defaultValue = defaultValue;
    this.okLabel = okLabel;
    this.cancelLabel = cancelLabel;
  }

  message = '';
  type: DialogType = DialogType.none;
  defaultValue?: string;
  okLabel?: string;
  cancelLabel?: string;
  okCallback?: (val?: any) => any = (a) => {
  };
  cancelCallback?: () => any = () => {
  };
}

export enum DialogType {
  none = -1,
  alert,
  confirm,
  prompt,
  close,
}

// ******************** End ********************//

// ******************** Growls ********************//
export class AlertMessage {
  constructor(
    public severity: MessageSeverity,
    public summary?: string,
    public detail?: string,
  ) {
  }
}

export enum MessageSeverity {
  default,
  info,
  success,
  error,
  warn,
  wait,
  close,
}

// ******************** End ********************//
