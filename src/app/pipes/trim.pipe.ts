import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.length < 50) {
      return value;
    }
    return value.toString().substring(0, 48) + "...";
  }

}
