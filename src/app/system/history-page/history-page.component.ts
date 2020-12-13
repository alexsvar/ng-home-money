import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Category } from '../shared/models/category.model';
import { WFMEvent } from '../shared/models/event.model';

@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(
    private categoriesService: CategoriesService,
    private eventsService: EventsService,
    private title: Title
  ) {
    title.setTitle('История');
  }

  isLoaded = false;
  subscription1: Subscription;

  categories: Category[] = [];
  events: WFMEvent[] = [];
  filteredEvents: WFMEvent[] = [];

  chartData = [];
  isFilterVisible = false;

  ngOnInit() {
    this.subscription1 = Observable.combineLatest(
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Category[], WFMEvent[]]) => {
      this.categories = data[0];
      this.events = data[1];

      this.setOriginalEvents();
      this.calculateChartData();

      this.isLoaded = true;
    });
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  calculateChartData(): void {
    this.chartData = [];

    this.categories.forEach((category) => {
      const categoryEvent = this.filteredEvents
        .filter((event) => event.category === category.id && event.type === 'outcome');
      this.chartData.push({
        name: category.name,
        value: categoryEvent.reduce((total, event) => {
          total += event.amount;
          return total;
        }, 0)
      });
    });
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    console.log(filterData);

    this.filteredEvents = this.filteredEvents
      .filter((event) => {
        return filterData.types.indexOf(event.type) !== -1;
    })
      .filter((event) => {
        return filterData.categories.indexOf(event.category.toString()) !== -1;
      })
      .filter((event) => {
        const momentDate = moment(event.date, 'DD.MM.YYYY HH.mm.ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });

    this.calculateChartData();
  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }

}
