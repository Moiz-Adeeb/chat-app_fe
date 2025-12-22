import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  NgbDateStruct,
  NgbDropdown,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  subDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DatePipe } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

dayjs.extend(utc);

@Component({
  selector: 'app-date-range-picker',
  styleUrls: ['./date-range-picker.component.css'],
  templateUrl: './date-range-picker.component.html',
  standalone: false,
})
export class DateRangePickerComponent implements OnInit {
  dropdownOpen = false;
  @Input() fromControl: FormControl = new FormControl();
  @Input() toControl: FormControl = new FormControl();
  @Output() onDateChanged = new EventEmitter<void>();
  @Input() fieldName = '';
  @Input() labelFontSize: string = 'text-[14px]';
  @Input() labelFontFamily: string = 'font-gilroy-semibold';
  get toDate(): NgbDateStruct {
    return this._toDate;
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  set toDate(value: NgbDateStruct) {
    this._toDate = value;
    this.toControl.setValue(
      format(
        new Date(this._toDate.year, this._toDate.month - 1, this._toDate.day),
        'yyyy-MM-dd',
      ),
    );
    this.cd.detectChanges();
  }

  get fromDate(): NgbDateStruct {
    return this._fromDate;
  }

  set fromDate(value: NgbDateStruct) {
    this._fromDate = value;
    this.fromControl.setValue(
      format(
        new Date(
          this._fromDate.year,
          this._fromDate.month - 1,
          this._fromDate.day,
        ),
        'yyyy-MM-dd',
      ),
    );
    this.cd.detectChanges();
  }

  private _fromDate!: NgbDateStruct;
  private _toDate!: NgbDateStruct;
  showCustom = false;
  selectedRangeLabel = 'Custom';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.choosedDate({
    //   startDate: dayjs(),
    //   endDate: dayjs(),
    // });
  }

  // Helper method to get today's date
  getToday(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  // Helper to format Date objects to NgbDateStruct
  getDateStruct(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  // Set the date range based on the selected option
  selectRange(range: string) {
    const today = new Date();
    switch (range) {
      case 'Today':
        this.fromDate = this.getDateStruct(startOfDay(today));
        this.toDate = this.getDateStruct(endOfDay(today));
        this.selectedRangeLabel = 'Today';
        break;
      case 'Yesterday':
        const yesterday = subDays(today, 1);
        this.fromDate = this.getDateStruct(startOfDay(yesterday));
        this.toDate = this.getDateStruct(endOfDay(yesterday));
        this.selectedRangeLabel = 'Yesterday';
        break;
      case 'Last 7 days':
        this.fromDate = this.getDateStruct(subDays(today, 7));
        this.toDate = this.getDateStruct(today);
        this.selectedRangeLabel = 'Last 7 days';
        break;
      case 'Last 14 days':
        this.fromDate = this.getDateStruct(subDays(today, 14));
        this.toDate = this.getDateStruct(today);
        this.selectedRangeLabel = 'Last 14 days';
        break;
      case 'Last 28 days':
        this.fromDate = this.getDateStruct(subDays(today, 28));
        this.toDate = this.getDateStruct(today);
        this.selectedRangeLabel = 'Last 28 days';
        break;
      case 'This month':
        this.fromDate = this.getDateStruct(startOfMonth(today));
        this.toDate = this.getDateStruct(today);
        this.selectedRangeLabel = 'This month';
        break;
      case 'Last month':
        const lastMonthStart = subDays(startOfMonth(today), 1);
        this._fromDate = this.getDateStruct(startOfMonth(lastMonthStart));
        this._toDate = this.getDateStruct(endOfMonth(lastMonthStart));
        this.selectedRangeLabel = 'Last month';
        break;
    }
    this.showCustom = false;
  }

  // Toggle the custom date picker
  toggleCustom() {
    this.showCustom = !this.showCustom;
    this.selectedRangeLabel = 'Custom';
  }

  // Handle custom date selection
  onDateChange(date: NgbDateStruct, type: 'from' | 'to') {
    if (type === 'from') {
      this._fromDate = date;
    } else if (type === 'to') {
      this._toDate = date;
    }
  }

  applyCustomRange() {
    this.showCustom = false;
  }

  cancelCustom() {
    this.showCustom = false;
  }

  // Set today's range by default
  setToday() {
    const today = this.getToday();
    this._fromDate = today;
    this._toDate = today;
    this.selectedRangeLabel = 'Today';
  }

  ranges: any = {
    Today: [dayjs(), dayjs()],
    Yesterday: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
    'This Year': [dayjs().startOf('year'), dayjs().endOf('year')],
    'All Time': [
      dayjs().startOf('year').subtract(5, 'year'),
      dayjs().endOf('year'),
    ],
  };

  choosedDate($event: any) {
    if (!$event) {
      return;
    }
    if (!$event.startDate) {
      return;
    }
    if (!$event.endDate) {
      return;
    }
    this.toDate = {
      day: $event.endDate.date(),
      month: $event.endDate.month() + 1,
      year: $event.endDate.year(),
    };
    this.fromDate = {
      day: $event.startDate.date(),
      month: $event.startDate.month() + 1,
      year: $event.startDate.year(),
    };
    this.onDateChanged.emit();
  }

  onRangeChanged($event: any) {
    this.selectedRangeLabel = $event.label;
  }
}
