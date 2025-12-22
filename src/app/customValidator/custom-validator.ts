import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AppRegex } from '../constants/app-regex';
import { DataType } from '../enums/data-type.enum';

export class CustomValidator {
  private static regex = new RegExp(AppRegex.PasswordRegex);
  static HardPassword(): ValidatorFn {
    const hardPasswordRegex = new RegExp(AppRegex.PasswordRegex);
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return { password: true }; // or null if required is separate
      }
      const valid = hardPasswordRegex.test(control.value);
      return valid ? null : { password: true };
    };
  }
  static dateNotBeforeTodayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return selectedDate < today ? { dateBeforeToday: true } : null;
    };
  }

  static min(min: number) {
    return Validators.min(min);
  }

  static max(max: number) {
    return Validators.max(max);
  }
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;

      if (!value) {
        return { email: true }; // or consider using 'required' validator separately
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      const valid = emailRegex.test(value);

      return valid ? null : { email: true };
    };
  }

  static swiftCodeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value === undefined || control.value == null) {
        return { swiftCode: true };
      }
      if (control.value.length !== min && control.value.length !== max) {
        return { swiftCode: true };
      }
      return null;
    };
  }

  static PasswordMatch(passwordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value === undefined || control.value == null) {
        return { match: true };
      }
      if (control.value !== passwordControl.value) {
        return { match: true };
      }
      return null;
    };
  }

  static Password(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = this.regex.test(control.value);
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : { password: true };
    };
    // const result = Validators.pattern(AppRegex.PasswordRegex);
    // return result.length ? null : { 'password': true };
  }

  static GreaterThan(
    minControl: AbstractControl,
    type: DataType = DataType.Number,
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (minControl == null || control == null) {
        return null;
      }
      if (type === DataType.Number) {
        if (+control.value <= +minControl.value) {
          return { greater: true, value: minControl.value };
        }
      }
      if (type === DataType.Date) {
        if (control.value <= minControl.value) {
          return { greater: true, value: minControl.value };
        }
      }

      return null;
    };
  }

  static LessThan(
    maxControl: AbstractControl,
    type: DataType = DataType.Number,
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (maxControl == null || control == null) {
        return null;
      }
      if (type === DataType.Number) {
        if (+control.value > +maxControl.value) {
          return { less: true, value: maxControl.value };
        }
      }
      if (type === DataType.Date) {
        if (control.value > maxControl.value) {
          return { less: true, value: maxControl.value };
        }
      }

      return null;
    };
  }

  static NoUnderScore(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value === undefined || control.value == null) {
        return { underscore: true };
      }
      if (control.value.toString().includes('_')) {
        return { underscore: true };
      }
      return null;
    };
  }

  static required(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return { required: true };
      }
      const value = control.value.toString().trim();
      if (value.length === 0) {
        return { required: true };
      }
      return null;
    };
  }

  static Phone(optional: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null;
      }
      const value = control.value.toString().trim();
      if (value.length === 0 && optional) {
        return null;
      }
      if (!(value.length > 10 && value.length <= 15)) {
        return { phone: true };
      }
      return null;
    };
  }
}
