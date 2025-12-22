import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { AppButtonComponent } from '../../../../shared/app-button/components/app-button/app-button.component';
import { ThemeToggleComponent } from '../../../../shared/theme-toggle/components/theme-toggle/theme-toggle.component';
import { AlertService } from '../../../../services/alert.service';
import { NgForOf, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export class VerifyOtpDTO {
  email: string;
  token: string;

  constructor(email: string, token: string) {
    this.email = email;
    this.token = token;
  }
}

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './verify-otp-page.component.html',
  styleUrl: './verify-otp-page.component.scss',
  standalone: true,
  imports: [
    AppButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
  ],
})
export class VerifyOtpPageComponent implements OnInit {
  email = '';
  showError = false;
  currentLanguage: string = 'en';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    // private otpClient: OtpClient,
    private translate: TranslateService,
  ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.setLanguage(saved);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const requestParam = params['request'];
      if (requestParam) {
        this.email = JSON.parse(requestParam);
      }
    });
  }

  onVerifyOtp(): void {
    this.router.navigate([`/reset-password`], {});
    // if (this.form.valid) {
    //   this.alertService.startLoadingMessage();
    //   this.otpClient
    //     .otp_VerifyOtp(
    //       new VerifyOtpRequestModel({
    //         otpCode: ((this.digit1Control.value ?? '') + (this.digit2Control.value ?? '') + (this.digit3Control.value ?? '') + (this.digit4Control.value ?? '')),
    //         email: this.email,
    //         type: OtpType.ForgetPassword,
    //       }),
    //     )
    //     .subscribe({
    //       next: (result: VerifyOtpResponseModel) => {
    //         this.alertService.stopLoadingMessage();
    //         this.router.navigate([`/reset-password`], {
    //           queryParams: {
    //             request: JSON.stringify(
    //               new VerifyOtpDTO(this.email, result.token ?? ''),
    //             ),
    //           },
    //         });
    //       },
    //     });
    // }
    // else {
    //   this.showError = true;
    // }
  }

  digit1Control = new FormControl('', [CustomValidator.required()]);
  digit2Control = new FormControl('', [CustomValidator.required()]);
  digit3Control = new FormControl('', [CustomValidator.required()]);
  digit4Control = new FormControl('', [CustomValidator.required()]);

  inputControls = [
    this.digit1Control,
    this.digit2Control,
    this.digit3Control,
    this.digit4Control,
  ];

  form = new FormGroup({
    digit1: this.digit1Control,
    digit2: this.digit2Control,
    digit3: this.digit3Control,
    digit4: this.digit4Control,
  });

  onResendOtp() {
    // this.alertService.startLoadingMessage();
    //   this.otpClient
    //     .otp_SendOtp(
    //       new SendOtpRequestModel({
    //         email: this.email,
    //         type: OtpType.ForgetPassword,
    //       }),
    //     )
    //     .subscribe({
    //       next: (result: SendOtpResponseModel) => {
    //         this.alertService.stopLoadingMessage();
    //       this.alertService.startLoadingMessage("Otp Send Successfully");
    //         },
    //     });
  }

  onBackLogin() {
    this.router.navigate([`/login`]);
  }
  onInputChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < this.inputControls.length - 1) {
      const nextInput = input.parentElement?.children[index + 1] as HTMLElement;
      nextInput?.focus();
    }

    this.showError = false;
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.parentElement?.children[index - 1] as HTMLElement;
      prevInput?.focus();
    }
  }
  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    this.currentLanguage = lang;
  }
}
