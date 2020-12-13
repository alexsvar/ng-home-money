import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { BillService } from '../shared/services/bill.service';
import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { WFMEvent } from '../shared/models/event.model';
import { Category } from '../shared/models/category.model';
import { Bill } from '../shared/models/bill.model';

@Component({
  selector: 'wfm-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

  isLoaded = false;
  subscription1: Subscription;

  bill: Bill;
  categories: Category[] = [];
  events: WFMEvent[] = [];

  constructor(
    private billService: BillService,
    private categoriesService: CategoriesService,
    private eventsService: EventsService,
    private title: Title
  ) {
    title.setTitle('Планирование');
  }

  ngOnInit() {
    this.subscription1 = Observable.combineLatest(
      this.billService.getBill(),
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Bill, Category[], WFMEvent[]]) => {
      this.bill = data[0];
      this.categories = data[1];
      this.events = data[2];

      this.isLoaded = true;
    });
  }

  getCategoryCost(category: Category): number {
    const categoryEvents = this.events
      .filter(event => event.category === category.id && event.type === 'outcome');
    return categoryEvents.reduce((total, event) => {
      total += event.amount;
      return total;
    }, 0);
  }

  private getPercent(category: Category): number {
    const percent = (100 * this.getCategoryCost(category) / category.capacity);
    return percent > 100 ? 100 : percent;
  }

  getCategoryPercent(category: Category): string {
    return this.getPercent(category) + '%';
  }

  getCategoryColorClass(category: Category): string {
    const percent = this.getPercent(category);
    return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
  }

  ngOnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }

}
