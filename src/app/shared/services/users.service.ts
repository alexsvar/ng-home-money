import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User> {
    return this.http.get(`http://localhost:3000/users?email=${email}`)
      .pipe(map((users: User[]) => users[0] ? users[0] : undefined));
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/users', user);
  }

}
