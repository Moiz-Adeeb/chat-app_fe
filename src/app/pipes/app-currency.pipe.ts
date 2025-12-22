import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency',
  standalone: false,
})
export class AppCurrencyPipe implements PipeTransform {
  transform(value: number | string | undefined): string {
    if (value == null || value === '') {
      value = 0;
    }

    const num = Number(value);
    return `${num.toFixed(2)} XAF`; // e.g. 31.43 XAF
  }
}
