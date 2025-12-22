import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolToLabel',
  standalone: false,
})
export class BoolToLabelPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value === true) {
      return '<span class="badge badge-success">Enabled</span>';
    }
    return '<span class="badge badge-danger">Disabled</span>';
  }
}
