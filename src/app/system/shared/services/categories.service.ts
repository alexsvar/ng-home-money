import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';

import { Category } from '../models/category.model';


@Injectable()
export class CategoriesService {
  constructor(private http: HttpClient) {
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>('http://localhost:3000/categories', category);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/categories');
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`http://localhost:3000/categories/${category.id}`, category);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`http://localhost:3000/categories/${id}`);
  }
}
