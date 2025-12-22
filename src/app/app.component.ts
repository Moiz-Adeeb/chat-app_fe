import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router, RouterOutlet,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  AlertDialog,
  AlertMessage,
  AlertService,
  DialogType,
  MessageSeverity,
} from './services/alert.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { AppLoaderModule } from './shared/app-loader/app-loader.module';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    AppLoaderModule,
    RouterOutlet,
    NgIf
  ]
})
export class AppComponent implements OnInit {
  title = 'real-time-chat-web-app';
  subscription: Subscription[] = [];
  isShowLoader = false;

  constructor(
    private alertService: AlertService,
    private toastService: ToastrService,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
  ) {
    this.subscription[0] = this.alertService
      .getDialogEvent()
      .subscribe((alert) => this.showDialog(alert));
    this.subscription[1] = this.alertService
      .getMessageEvent()
      .subscribe((message) => this.showToast(message, false));
    this.subscription[2] = this.alertService
      .getStickyMessageEvent()
      .subscribe((message) => this.showToast(message, true));
    // this.toastyConfig.theme = 'bootstrap';
    this.router.events.subscribe((event: any) => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof NavigationStart
      ) {
        this.alertService.startLoadingMessage();
      } else if (
        event instanceof RouteConfigLoadEnd ||
        event instanceof NavigationEnd
      ) {
        this.alertService.stopLoadingMessage();
      }
    });
    this.init();
    // Initialize theme service to apply saved theme
    this.themeService.getCurrentTheme();
  }

  ngOnInit(): void {
    // Force theme initialization
    this.themeService.setTheme(this.themeService.getCurrentTheme());
  }

  init(): void {
    this.authService.getLoginStatusEvent().subscribe((result) => {
      if (!result) {
        this.alertService.showMessage(
          'Success',
          'User has logout Successfully',
          MessageSeverity.info,
        );
      } else {
      }
    });
  }

  showDialog(dialog: AlertDialog): void {
    // if (dialog === undefined) {
    //   this.modalService.dismissAll();
    //   return;
    // }
    // if (dialog.type === DialogType.close) {
    //   this.modalService.dismissAll();
    //   return;
    // }
    // dialog.okLabel = dialog.okLabel || 'OK';
    // dialog.cancelLabel = dialog.cancelLabel || 'Cancel';
    // const modal = this.modalService.open(DialogComponent, {
    //   centered: true,
    //   backdrop: 'static',
    //   size: 'sm',
    // });
    // const instance = modal.componentInstance as DialogComponent;
    // instance.initDialog(dialog);
    // instance.NoClick = () => {
    //   modal.close();
    // };
  }

  showToast(message: AlertMessage, isSticky: boolean): void {
    let delay = 0;
    if (message === undefined) {
      $.notifyClose();
      this.isShowLoader = false;
      return;
    }
    if (message.severity === MessageSeverity.close) {
      this.toastService.clear();
      this.isShowLoader = false;
      return;
    }
    if (message.severity === MessageSeverity.wait) {
      delay = 0;
    } else {
      delay = 3000;
    }
    // const toastOptions: ToastOptions = {
    //   title: message.summary,
    //   msg: message.detail,
    //   showClose: true,
    //   timeout: delay,
    // };
    this.showMessageBySeverity(message);
    // $.notifyDefaults({
    //   allow_dismiss: true,
    //   z_index: 1051
    // });
    //
    // $.notify({
    //   icon: 'notifications',
    //   message: message.detail,
    //   title: message.summary,
    // }, {
    //   type: this.getClassBySeverity(message.severity),
    //   delay: delay,
    //   z_index: 1051,
    //   placement: {
    //     from: 'top',
    //     align: 'right'
    //   },
    //   template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
    //     '<button type="button" aria-hidden="true" data-notify="dismiss">×</button>' +
    //     '<span data-notify="icon"></span> ' +
    //     '<span data-notify="title">{1}</span> ' +
    //     '<span data-notify="message">{2}</span>' +
    //     '<div class="progress" data-notify="progressbar">' +
    //     '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    //     '</div>' +
    //     '<a href="{3}" target="{4}" data-notify="url"></a>' +
    //     '</div>'
    // });
  }

  showMessageBySeverity(message: AlertMessage): void {
    switch (message.severity) {
      case MessageSeverity.success:
        this.toastService.success(message.detail, message.summary);
        break;
      case MessageSeverity.error:
        this.toastService.error(message.detail, message.summary);
        break;
      case MessageSeverity.warn:
        this.toastService.warning(message.detail, message.summary);
        break;
      case MessageSeverity.info:
        this.toastService.info(message.detail, message.summary);
        break;
      case MessageSeverity.wait:
        this.isShowLoader = true;
        break;
    }
  }

  getClassBySeverity(severity: MessageSeverity): string {
    switch (severity) {
      case MessageSeverity.success:
        return 'success';
      case MessageSeverity.error:
        return 'danger';
      case MessageSeverity.warn:
        return 'warn';
      case MessageSeverity.info:
        return 'info';
      case MessageSeverity.wait:
        return 'info';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.subscription.forEach((p) => p.unsubscribe());
  }
}
