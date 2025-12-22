import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from "angular-svg-icon";
import { environment } from '../../../../../environments/environment';
import {
  GenerateResetPasswordTokenRequestModel,
  UserClient,
} from '../../../../api/api-old';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { AppButtonComponent } from '../../../../shared/app-button/components/app-button/app-button.component';
import { AppTextFieldComponent } from '../../../../shared/app-text-field/components/app-text-field/app-text-field.component';
import { LanguageToggleComponent } from '../../../../shared/language-toggle/components/language-toggle/language-toggle.component';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
  standalone: true,
  imports: [
    AppTextFieldComponent,
    AppButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    LanguageToggleComponent,
    TranslatePipe
  ],
})
export class ForgotPasswordPageComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private userClient: UserClient,
    private translate: TranslateService,
  ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.setLanguage(saved);
  }
  currentLanguage: string = 'en';

  ngOnInit(): void {
    this.authService.reevaluateLoginStatus();
    // if (this.authService.isLoggedIn && this.authService.currentUser.role == RoleNames.Customer) {
    //   this.authService.redirectLoggedInUser();
    // } else {
    //   if (this.authService.isLoggedIn) {
    //   } else {
    //     const guestLogin = new GuestLogin(this.loginService, this.authService);
    // guestLogin.loginAsGuest();
    // }
    // }
  }

  onResetPasswordPage(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
    if (this.form.valid) {
      this.alertService.startLoadingMessage();
      this.userClient
        .user_GenerateResetPassword(
          new GenerateResetPasswordTokenRequestModel({
            email: this.emailControl.value ?? '',
            host: environment.emailUrl ?? '',
          }),
        )
        .subscribe((value) => {
          this.alertService.stopLoadingMessage();
          this.alertService.showSuccessMessage(
            this.translate.instant('SentToEmail'),
          );
        });
    }
  }

  onBackLogin(): void {
    this.router.navigate([`/login`]);
  }

  emailControl = new FormControl('', [
    CustomValidator.required(),
    Validators.email,
  ]);
  form: FormGroup = new FormGroup({
    email: this.emailControl,
  });
  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    this.currentLanguage = lang;
  }
}
