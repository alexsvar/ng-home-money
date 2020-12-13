import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';


import { Category } from '../../shared/models/category.model';
import { WFMEvent } from '../../shared/models/event.model';
import { EventsService } from '../../shared/services/events.service';
import { BillService } from '../../shared/services/bill.service';
import { Bill } from '../../shared/models/bill.model';
import { Message } from '../../../shared/models/message.model';

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  subscription1: Subscription;
  subscription2: Subscription;

  @Input() categories: Category[] = [];

  types = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];

  message: Message;

  constructor(
    private eventsService: EventsService,
    private billService: BillService
  ) {}

  ngOnInit() {
    this.message = new Message('danger', '');
  }

  private showMessage(text: string) {
    this.message.text = text;
    window.setTimeout(() => this.message.text = '', 5000);
  }

  onSubmit(form: NgForm) {
    let {amount, description, category, type} = form.value;
    if (amount < 0) {
      amount *= -1;
    }

    const event = new WFMEvent(type, amount, +category,
      moment().format('DD.MM.YYYY HH:mm:ss'), description);

    this.subscription1 = this.billService.getBill()
      .subscribe((bill: Bill) => {
      let value = 0;
        if (type === 'outcome') {
          if (amount > bill.value) {
            this.showMessage(`На счёте недостаточно средств. Вам не хватает ${amount - bill.value}`);
            return;
          } else {
            value = bill.value - amount;
          }
        } else {
          value = bill.value + amount;
        }

        this.subscription2 = this.billService.updateBill({value, currency: bill.currency})
          .mergeMap(() => this.eventsService.addEvent(event))
          .subscribe(() => {
            form.setValue({
              amount: 0,
              description: ' ',
              category: 1,
              type: 'outcome'
            });
          });
      });

  }

  ngOnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }

    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
