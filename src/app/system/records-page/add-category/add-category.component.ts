import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'wfm-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnDestroy {
  subscription1: Subscription;

  @Output() onCategoryAdd = new EventEmitter<Category>();

  constructor(private categoriesService: CategoriesService) {}

  onSubmit(form: NgForm) {
    let { name, capacity } = form.value;
    if (capacity < 0 ) { capacity *= -1; }

    const category = new Category(name, capacity);

    this.subscription1 = this.categoriesService.addCategory(category)
      .subscribe((category: Category) => {
        form.reset();
        form.form.patchValue({ capacity: 1 });
        this.onCategoryAdd.emit(category);
      });
  }

  ngOnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }

}
