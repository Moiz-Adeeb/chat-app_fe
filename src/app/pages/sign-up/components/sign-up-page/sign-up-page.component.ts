import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from "angular-svg-icon";
import { RegisterUserRequestModel, SignUpClient } from '../../../../api/api';
import { CompanyClient, RegisterCompanyRequestModel } from '../../../../api/api-old';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { AppButtonComponent } from "../../../../shared/app-button/components/app-button/app-button.component";
import { AppDropdownComponent } from "../../../../shared/app-dropdown/components/app-banner/app-dropdown.component";
import { AppTextFieldComponent } from '../../../../shared/app-text-field/components/app-text-field/app-text-field.component';
import { AppUploadModule } from "../../../../shared/app-upload/app-upload.module";
import { LanguageToggleComponent } from '../../../../shared/language-toggle/components/language-toggle/language-toggle.component';
import { AlertService } from './../../../../services/alert.service';

@Component({
  selector: 'app-sign-up-page',
  imports: [FormsModule, CommonModule, AngularSvgIconModule, TranslatePipe, AppTextFieldComponent, FormsModule,  AppUploadModule, AppButtonComponent, LanguageToggleComponent],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  currentLanguage: string = 'en';

  constructor(
    private signUpClient: SignUpClient,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService,
    ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.setLanguage(saved);
     }
     businessCertificate: EventEmitter<{}> = new EventEmitter<{}>
  section = 1;

  onFileUploaded(event: { base64: string; fileType: string; extension: string; file: File }, controlName: string) {
    if (event && event.base64) {
      this.signUpFormGroup.get(controlName)?.setValue(event.base64);
    }
  }

  userNameControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);

  nameControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);

  statusControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);

  passwordControl = new FormControl('', [
    CustomValidator.required(),
    // CustomValidator.Password(),
    Validators.maxLength(50),
  ]);

  confirmPasswordControl = new FormControl('', [
    CustomValidator.required(),
    CustomValidator.PasswordMatch(this.passwordControl),
    Validators.maxLength(50),
  ]);




  firstNameControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);
  lastNameControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);
  emailControl = new FormControl('', [
    CustomValidator.required(),
    Validators.email,
  ]);
  phoneNumberControl = new FormControl('', [
    CustomValidator.required(),
    CustomValidator.Phone()
  ]);


  companyNameControl = new FormControl('', [
    CustomValidator.required(),
    Validators.maxLength(50),
  ]);
  businessRegistrationCertificateControl = new FormControl('', [
    CustomValidator.required(),
  ]);
  vatCertificateControl = new FormControl('', [
    CustomValidator.required(),
  ]);
  authorizationIdProofControl = new FormControl('', [
    CustomValidator.required(),
  ]);

  signUpFormGroup: FormGroup = new FormGroup({
    name: this.nameControl,
    userName: this.userNameControl,
    status: this.statusControl,
    password: this.passwordControl,
    confirmPassword: this.confirmPasswordControl,
  });

  onSignUp() {
    // Validate section 2 fields (document uploads)
    this.nameControl.markAsTouched();
    this.nameControl.updateValueAndValidity();
    this.userNameControl.markAsTouched();
    this.userNameControl.updateValueAndValidity();
    this.statusControl.markAsTouched();
    this.statusControl.updateValueAndValidity();
    this.passwordControl.markAsTouched();
    this.passwordControl.updateValueAndValidity();
    this.confirmPasswordControl.markAsTouched();
    this.confirmPasswordControl.updateValueAndValidity();

    // Check if section 2 is valid
    const sectionValid = this.nameControl.valid &&
                          this.userNameControl.valid &&
                          this.statusControl.valid;
                          this.passwordControl.valid;
                          this.confirmPasswordControl.valid;

    if (!sectionValid) {
      const invalidControl = document.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.alertService.showErrorMessage(
        this.translate.instant('PleaseCompleteAllRequiredFields'),
      );
      return;
    }

    // If section is valid, proceed with registration
    if (this.signUpFormGroup?.valid) {
      this.alertService.startLoadingMessage('Authenticating...');
      this.signUpClient.registerUser(
        new RegisterUserRequestModel({
          name: this.nameControl.value ?? '',
          userName: this.userNameControl.value ?? '',
          status: this.statusControl.value ?? '',
          password: this.passwordControl.value ?? '',
          confirmPassword: this.confirmPasswordControl.value ?? '',
        })
      ).subscribe((value) => {
          this.alertService.stopLoadingMessage();
        this.router.navigate(['/login']);
        setTimeout(()=>{
          this.alertService.showSuccessMessage(
            this.translate.instant('SentToEmail'),
          );
        });
      });
    }
  }

  onSignIn() {
    this.router.navigate(['/login']);
  }

  next() {
    // Validate only section 1 fields before moving to section 2
    this.firstNameControl.markAsTouched();
    this.firstNameControl.updateValueAndValidity();
    this.lastNameControl.markAsTouched();
    this.lastNameControl.updateValueAndValidity();
    this.emailControl.markAsTouched();
    this.emailControl.updateValueAndValidity();
    this.phoneNumberControl.markAsTouched();
    this.phoneNumberControl.updateValueAndValidity();
    this.companyNameControl.markAsTouched();
    this.companyNameControl.updateValueAndValidity();

    // Check if section 1 is valid
    const section1Valid = this.firstNameControl.valid &&
                          this.lastNameControl.valid &&
                          this.emailControl.valid &&
                          this.phoneNumberControl.valid &&
                          this.companyNameControl.valid;

    if (section1Valid) {
      this.section = this.section + 1;
    } else {
      const invalidControl = document.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.alertService.showErrorMessage(
        this.translate.instant('PleaseCompleteAllRequiredFields'),
      );
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
