import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeType } from '../api/api';

@Pipe({
  name: 'employeeTypeLabel',
  standalone: true,
})
export class EmployeeTypeLabelPipe implements PipeTransform {
  transform(value: EmployeeType | number | undefined): string {
    switch (value) {
      case EmployeeType.Remote:
        return 'Remote';
      case EmployeeType.Onsite:
        return 'Onsite';
      default:
        return '—';
    }
  }
}
