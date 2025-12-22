import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EndpointFactoryService } from './endpoint-factory.service';
import { KeyValue } from '@angular/common';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ImportCsvService extends EndpointFactoryService {
  importCsv(
    url: string,
    file: File,
    extra: KeyValue<any, any>[] = [],
  ): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('file', file as Blob, file.name);
    extra.forEach((p) => {
      formData.append(p.key, p.value);
    });
    return this.http
      .post(this.baseUrl + url, formData, {
        headers: this.getFormDataRequestHeaders().headers,
      })
      .pipe(map((response) => response as ResponseModel));
  }

  export(url: string): Observable<any> {
    return this.http.post(this.baseUrl + url, null, {
      responseType: 'blob',
    });
  }

  private getDateFormat(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const hh = String(today.getHours()).padStart(2, '0');
    const MM = String(today.getMinutes()).padStart(2, '0');
    const ss = String(today.getSeconds()).padStart(2, '0');
    return mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + MM + ':' + ss;
  }

  downloadFile(fileBlob: Blob, filePre: string): void {
    if (fileBlob === undefined) {
      return;
    }
    const type = 'text/csv';
    const fileName = filePre + '-' + this.getDateFormat() + '.csv';
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const newBlob = new Blob([fileBlob], { type });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    const nav = window.navigator as any;
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(newBlob, fileName);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }
}
