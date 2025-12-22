import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { NgIf } from '@angular/common';
import { translate } from '@angular/localize/tools';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class FormErrorComponent {
  constructor(private translate: TranslateService) {}
  get control(): FormControl {
    return this._control;
  }

  @Input() set control(value: FormControl) {
    this._control = value;
  }

  @Input() _control: FormControl = new FormControl();
  @Input() fieldName: string = 'Field';
  @Input() isDisplayError: boolean = true;

  get shouldShowError(): boolean {
    return (
      this.control.invalid &&
      (this.control.dirty || this.control.touched) &&
      this.isDisplayError
    );
  }

  get errorMessage(): string {
    if (this._control.invalid && this._control.errors != null) {
      if (this._control.errors['pattern']) {
        return this.fieldName + ' ' + this.translate.instant('IsNotValid');
      }
      if (this._control.errors['match']) {
        return this.fieldName + ' ' + this.translate.instant('DoesNotMatch');
      }
      if (this._control.errors['required']) {
        return this.fieldName + ' ' + this.translate.instant('IsRequired');
      }
      if (this._control.errors['phone']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('HasInvalidFormatItMustBe')
        );
      }
      if (this._control.errors['minlength']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('MustBeHaveALengthOf') +
          ' ' +
          this._control.errors['minlength'].requiredLength
        );
      }
      if (this._control.errors['maxlength']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('MustBeHaveALengthLessThan') +
          ' ' +
          this._control.errors['maxlength'].requiredLength
        );
      }
      if (this._control.errors['email']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('HasInvalidFormatItMustBe(test@gmail.com)')
        );
      }
      if (this._control.errors['password']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant(
            'MustContainAtLeast8CharactersADigitAnUppercaseLetterALowercaseLetterAndASpecialCharacter',
          )
        );
      }
      if (this._control.errors['min']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('MustBeGreaterThanOrEqualTo') +
          ' ' +
          this._control.errors['min'].min
        );
      }

      if (this._control.errors['max']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('MustBeLessThanOrEqualTo') +
          ' ' +
          this._control.errors['max'].max
        );
      }

      if (this._control.errors['greater']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('MustBeGreaterThan') +
          ' ' +
          this._control.errors['value']
        );
      }
      if (this._control.errors['dateBeforeToday']) {
        return (
          this.fieldName + ' ' + this.translate.instant('CannotBeBeforeToday')
        );
      }

      if (this._control.errors['less']) {
        return (
          this.fieldName +
          ' ' +
          this.translate.instant('MustBeLessThan') +
          ' ' +
          this._control.errors['value']
        );
      }
    }
    return '';
  }
}
