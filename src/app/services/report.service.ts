import { Injectable } from '@angular/core';
import { EndpointFactoryService } from './endpoint-factory.service';
import { Sale } from '../pages/dashboard/sales/models/sale';
import { Observable } from 'rxjs';
import { Purchase } from '../pages/dashboard/purchases/models/purchase';
import { PurchaseReturn } from '../pages/dashboard/purchase-returns/models/purchase-return';
import { SaleReturn } from '../pages/dashboard/sale-returns/models/sale-return';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends EndpointFactoryService {
  private readonly baseUrl: string =
    this.configurations.baseUrl + '/api/v1/report';

  getSaleInvoice(row: Sale): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.saleUrl(row.id), httpOptions);
  }

  getPurchaseInvoice(row: Purchase): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.purchaseUrl(row.id), httpOptions);
  }

  getPurchaseReturnInvoice(row: PurchaseReturn): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.purchaseReturnUrl(row.id), httpOptions);
  }

  getSaleReturnInvoice(row: SaleReturn): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.saleReturnUrl(row.id), httpOptions);
  }

  private saleUrl(id: number): string {
    return this.baseUrl + '/sale/' + id;
  }

  private purchaseUrl(id: number): string {
    return this.baseUrl + '/purchase/' + id;
  }

  private purchaseReturnUrl(id: number): string {
    return this.baseUrl + '/purchaseReturn/' + id;
  }

  private saleReturnUrl(id: number): string {
    return this.baseUrl + '/saleReturn/' + id;
  }
}
