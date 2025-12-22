import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDate',
  standalone: false,
})
export class AppDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(
      value: string | undefined | Date,
      format: string = 'MM/dd',
    ): string {
      if (!value) {
        return '';
      }

      const inputDate = new Date(value);
      const today = new Date();
      const yesterday = new Date(); 
      yesterday.setDate(today.getDate() - 1);

      const dateString = this.datePipe.transform(value, format);
      const timeString = this.datePipe.transform(value, 'HH:mm');

      // Check if the date is today or yesterday
      const day = (input: Date, check: Date) =>
        input.getDate() === check.getDate() &&
        input.getMonth() === check.getMonth() &&
        input.getFullYear() === check.getFullYear();

      if (day(inputDate, today)) {
        return `Today ${timeString}`;
      }

      if (day(inputDate, yesterday)) {
        return `Yesterday ${timeString}`
      }

      const result = this.datePipe.transform(value, format);
      return `${dateString} ${timeString}`;
    }
}
