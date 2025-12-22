import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { FormErrorComponent } from '../../../app-text-field/components/form-error/form-error.component';

@Component({
  selector: 'app-search-field',
  templateUrl: './app-search-field.component.html',
  styleUrl: './app-search-field.component.scss',
  standalone: true,
  imports: [
    FormErrorComponent,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ]
})
export class AppSearchFieldComponent {
  isRequired = false;
  subscription: Subscription = Subscription.EMPTY;
  @Output() onChange = new EventEmitter<string>();
  @Input() isCompact = false;
  @Input() type: 'primary' | 'secondary'  = 'primary';
  @Input() fieldName = '';
  @Input() labelFontSize: string = 'text-[14px]';
  @Input() labelFontFamily: string = 'font-gilroy-semibold';
  @Input() icon: boolean = true;

  @Input() fieldType:
    | 'text'
    | 'number'
    | 'password'
    | 'email'
    | 'date'
    | 'datetime-local' = 'text';
  @Input() noMargin = false;
  @Input() iconImage = '';
  @Input() iconToolTip = '';
  @Output() iconClick = new EventEmitter();
  @Input() hasMargin = true;
  @Input() showError = true;
  @Input() placeholder = '';
  today: string = new Date().toISOString().split('T')[0];
  dateTime: string = new Date().toISOString().slice(0, 16);

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
    this.isRequired = this._fieldControl.hasValidator(CustomValidator.required());
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

    this.subscription = this._fieldControl.valueChanges.subscribe((value) => {
      this.onChange.emit(value);      // new output
    });
  }


  onIconClick(): void {
    this.iconClick.emit();
  }
}
