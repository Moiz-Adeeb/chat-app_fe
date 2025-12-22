import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './date-range-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FormErrorComponent } from '../app-text-field/components/form-error/form-error.component';

@NgModule({
  declarations: [DateRangePickerComponent],
  exports: [DateRangePickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    ClickOutsideDirective,
    FormErrorComponent,
  ],
})
export class DateRangePickerModule {}
