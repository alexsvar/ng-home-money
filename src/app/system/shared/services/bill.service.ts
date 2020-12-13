import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Rx';

import { Bill } from '../models/bill.model';

@Injectable()
export class BillService {
  constructor(private http: HttpClient) {}

  getBill(): Observable<Bill> {
    return this.http.get<Bill>('http://localhost:3000/bill');
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.http.put<Bill>('http://localhost:3000/bill', bill);
  }

  getCurrency(base: string = 'RUB'): Observable<any> {
    return this.http.get<Bill>(`https://api.exchangeratesapi.io/latest?base=${base}`);
  }
}
