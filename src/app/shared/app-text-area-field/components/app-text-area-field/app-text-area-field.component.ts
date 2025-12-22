import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidator} from '../../../../customValidator/custom-validator';
import {NgClass, NgIf} from '@angular/common';
import {FormErrorComponent} from '../../../app-text-field/components/form-error/form-error.component';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './app-text-area-field.component.html',
  styleUrl: './app-text-area-field.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormErrorComponent,
    NgIf
  ]
})
export class AppTextAreaFieldComponent {
  isRequired = false;
  @Input() rows = 5;
  subscription: Subscription = Subscription.EMPTY;
  @Output() selectChanged = new EventEmitter();
  @Input() fieldName = '';
  @Input() isCompact = false;
  @Input() noMargin = false;
  @Input() icon = '';
  @Input() iconToolTip = '';
  @Output() iconClick = new EventEmitter();
  @Input() hasMargin = true;
  @Input() showError = true;
  @Input() placeholder = '';

  constructor() {}

  private _fieldControl: FormControl = new FormControl(null, []);

  get fieldControl(): FormControl {
    return this._fieldControl;
  }

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
    this.subscription = this._fieldControl.valueChanges.subscribe((p) => {
      this.selectChanged.emit(p);
    });
  }

  onIconClick(): void {
    this.iconClick.emit();
  }
}
