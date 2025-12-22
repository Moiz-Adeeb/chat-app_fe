import { Injectable } from '@angular/core';
import { EndpointFactoryService } from './endpoint-factory.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CodeDto } from '../models/code-dto';
import { map } from 'rxjs/operators';
import { EntityType } from '../enums/data-type.enum';

@Injectable({
  providedIn: 'root',
})
export class CodeService extends EndpointFactoryService {
  private readonly codebaseUrl: string =
    this.configurations.baseUrl + '/api/v1/Code';

  getCode(type: EntityType): Observable<CodeDto> {
    const params = new HttpParams().set('Type', +type);
    return this.http
      .get(this.codebaseUrl, { params })
      .pipe(map((p) => p as CodeDto));
  }
}
