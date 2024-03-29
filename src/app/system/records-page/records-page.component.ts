import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Category } from '../shared/models/category.model';
import { CategoriesService } from '../shared/services/categories.service';

@Component({
  selector: 'wfm-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  categories: Category[] = [];
  isLoaded = false;

  constructor(
    private categoriesService: CategoriesService,
    private title: Title
  ) {
    title.setTitle('Запись');
  }

  ngOnInit() {
    this.categoriesService.getCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.isLoaded = true;
      });
  }

  newCategoryAdded(category: Category) {
    this.categories.push(category);
  }

  categoryWasEdited(category: Category) {
    const index = this.categories
      .findIndex(c => c.id === category.id);

    this.categories[index] = category;
  }

}
