import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from "angular-svg-icon";
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { UserLogin } from '../../../../models/user-login.model';
import {
  AlertService,
  MessageSeverity,
} from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { LoginService } from '../../../../services/login.service';
import { SignalRService } from '../../../../services/signal-r.service';
import { Theme, ThemeService } from '../../../../services/theme.service';
import { AppButtonComponent } from '../../../../shared/app-button/components/app-button/app-button.component';
import { AppTextFieldComponent } from '../../../../shared/app-text-field/components/app-text-field/app-text-field.component';
import { LanguageToggleComponent } from '../../../../shared/language-toggle/components/language-toggle/language-toggle.component';
import { ThemeToggleComponent } from '../../../../shared/theme-toggle/components/theme-toggle/theme-toggle.component';


@Component({
  selector: 'app-getting-started-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TranslatePipe,
    AppButtonComponent,
    AppTextFieldComponent,
    LanguageToggleComponent,
    AngularSvgIconModule
],
})
export class LoginPageComponent implements OnInit {
  currentLanguage: string = 'en';
  currentTheme: Theme = 'light';
  showThemeMenu: boolean = false;
  enableMfa: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    // private userClient: UserClient,
    private loginService: LoginService,
    private translate: TranslateService,
    public themeService: ThemeService,
    public signalR: SignalRService
  ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.setLanguage(saved);
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  loginData = {
    username: '',
    password: '',
    rememberMe: false,
  };

  ngOnInit(): void {
    // this.authService.reevaluateLoginStatus();
    // if (this.authService.isLoggedIn) {
    //   this.authService.redirectLoggedInUser();
    // }
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }


  onSubmit(): void {
    Object.values(this.loginFormGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (this.loginFormGroup?.valid) {
      this.alertService.startLoadingMessage('Authenticating...');
      const userLogin = new UserLogin();
      userLogin.userName = this.emailControl.value ?? '';
      userLogin.password = this.passwordControl.value ?? '';


      this.loginService.login(userLogin).subscribe((result) => {
        this.alertService.stopLoadingMessage();
        const user = this.authService.processLogin(result);

        setTimeout(() => {
          this.alertService.showMessage(
            'Success',
            `Welcome ${user?.name} `,
            MessageSeverity.success,
          );
        }, 500);
        this.signalR.init();
        this.signalR.connect();
        this.authService.redirectLoggedInUser();
      });
    }
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }

  emailControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);
  passwordControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);
  loginFormGroup: FormGroup = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
  });

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    this.currentLanguage = lang;
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
    this.showThemeMenu = false;
  }

  toggleThemeMenu() {
    this.showThemeMenu = !this.showThemeMenu;
  }

  closeThemeMenu() {
    this.showThemeMenu = false;
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'fa-sun';
      case 'dark':
        return 'fa-moon';
      case 'system':
        return 'fa-desktop';
      default:
        return 'fa-sun';
    }
  }
}
