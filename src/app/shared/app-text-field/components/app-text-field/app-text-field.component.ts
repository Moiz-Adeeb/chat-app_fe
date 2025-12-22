import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  selector: 'app-text-field',
  templateUrl: './app-text-field.component.html',
  styleUrl: './app-text-field.component.scss',
  standalone: true,
  imports: [FormErrorComponent, ReactiveFormsModule, NgClass, NgIf],
})
export class AppTextFieldComponent {
  isRequired = false;
  @Input() enableAutoFill: boolean = false;
  subscription: Subscription = Subscription.EMPTY;
  @Input() readonly: boolean = false;
  @Output() selectChanged = new EventEmitter();
  @Input() fieldName = '';
  @Input() isCompact = false;
  @Input() type: 'primary' | 'secondary' = 'primary';

  @Input() fieldType:
    | 'text'
    | 'number'
    | 'password'
    | 'email'
    | 'date'
    | 'datetime-local'
    | 'time' = 'text';
  @Input() labelFontSize: string = 'text-[14px]';
  @Input() labelFontFamily: string = 'font-gilroy-semibold';
  @Input() showShadow: boolean = true; // default true
  @Input() showBorder: boolean = false; // default false
  @Input() noMargin = false;
  @Input() icon = '';
  @Input() iconType: 'img' | 'fav' = 'img';
  @Input() iconToolTip = '';
  @Output() iconClick = new EventEmitter();
  @Input() hasMargin = true;
  @Input() showError = true;
  @Input() placeholder = '';
  today: string = new Date().toISOString().split('T')[0];
  dateTime: string = new Date().toISOString().slice(0, 16);

  showErrorState(): boolean {
    return (
      this.fieldControl.invalid &&
      (this.fieldControl.dirty || this.fieldControl.touched)
    );
  }

  onBlur(): void {
    this.fieldControl.markAsTouched();
    this.fieldControl.updateValueAndValidity();
  }
  constructor() {}

  private _fieldControl: FormControl = new FormControl(null, []);

  get fieldControl(): FormControl {
    return this._fieldControl;
  }
  isPasswordVisible = false;
  @Input() set fieldControl(value: FormControl | undefined) {
    if (value === null || value === undefined) {
      return;
    }
    this._fieldControl = value;
    this.isRequired = this._fieldControl.hasValidator(
      CustomValidator.required(),
    );
    this.initListener();
  }

  ngOnInit(): void {
    this.initListener();
  }

  initListener(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
    }
    this.subscription = this._fieldControl.valueChanges.subscribe((p) => {
      this.selectChanged.emit(p);
    });
  }

  onIconClick(): void {
    this.iconClick.emit();
  }
}
