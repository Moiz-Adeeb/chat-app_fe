import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { AppButtonComponent } from '../../../../shared/app-button/components/app-button/app-button.component';
import { AppTextFieldComponent } from '../../../../shared/app-text-field/components/app-text-field/app-text-field.component';
import { ThemeToggleComponent } from '../../../../shared/theme-toggle/components/theme-toggle/theme-toggle.component';
import { VerifyOtpDTO } from '../../../verify-otp/components/verify-otp-page/verify-otp-page.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ResetPasswordRequestModel, ResetPasswordResponseModel, UserClient } from '../../../../api/api-old';
import { AlertService } from '../../../../services/alert.service';
import { LanguageToggleComponent } from '../../../../shared/language-toggle/components/language-toggle/language-toggle.component';
import { AppResetPasswordSuccessDialogComponent } from '../app-reset-password-success-dialog/app-reset-password-success-dialog.component';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
  standalone: true,
  imports: [
    AppTextFieldComponent,
    AppButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    LanguageToggleComponent,
    TranslatePipe,
  ],
})
export class ResetPasswordPageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal,
    private userClient: UserClient,
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.setLanguage(saved);
  }
  emailOrToken: VerifyOtpDTO = new VerifyOtpDTO('', '');
  currentLanguage: string = 'en';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const email = params['email'];

      if (token && email) {
        this.emailOrToken = new VerifyOtpDTO(email, token);
      } else {
        // Fallback for old format with JSON request parameter
        const requestParam = params['request'];
        if (requestParam) {
          this.emailOrToken = JSON.parse(requestParam);
        }
      }
    });
  }
  onResetPasswordClick() {
    if (this.form.valid) {
      this.alertService.startLoadingMessage();
      this.userClient
        .user_ResetPassword(
          new ResetPasswordRequestModel({
            email: this.emailOrToken.email,
            confirmPassword: this.confirmPasswordControl.value ?? '',
            password: this.form.value.password,
            token: this.emailOrToken.token,
          }),
        )
        .subscribe({
          next: (result: ResetPasswordResponseModel) => {
            this.alertService.stopLoadingMessage();
            const modalRef = this.modal.open(
              AppResetPasswordSuccessDialogComponent,
            );
          },
        });
    }
  }

  passwordControl = new FormControl('', [
    CustomValidator.required(),
    CustomValidator.Password(),
    Validators.maxLength(50),
  ]);

  confirmPasswordControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
    CustomValidator.PasswordMatch(this.passwordControl),
  ]);

  // The form group including the controls and the validator
  form: FormGroup = new FormGroup({
    password: this.passwordControl,
    confirmPassword: this.confirmPasswordControl,
  });
  onBackLogin(): void {
    this.router.navigate([`/login`]);
  }
  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    this.currentLanguage = lang;
  }
}
