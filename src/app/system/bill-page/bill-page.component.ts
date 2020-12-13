import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs-compat/Rx';
import { Title } from '@angular/platform-browser';

import { BillService } from '../shared/services/bill.service';
import { Bill } from '../shared/models/bill.model';



@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  subscription1: Subscription;
  subscription2: Subscription;

  currency: any;
  bill: Bill;

  isLoaded = false;

  constructor(
    private billService: BillService,
    private title: Title
    ) {
    title.setTitle('Счёт');
  }

  ngOnInit() {
    this.subscription1 = Observable.combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency()
    ).subscribe((data: [Bill, any]) => {
      this.bill = data[0];
      this.currency = data[1];
      this.isLoaded = true;
    });
  }

  onRefresh() {
    this.isLoaded = false;
    this.subscription2 = this.billService.getCurrency()
      .subscribe((currency: any) => {
        this.currency = currency;
        this.isLoaded = true;
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
