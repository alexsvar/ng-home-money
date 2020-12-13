import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat';

import { WFMEvent } from '../models/event.model';

@Injectable()
export class EventsService {
  constructor(private http: HttpClient) {
  }

  addEvent(event: WFMEvent): Observable<WFMEvent> {
    return this.http.post<WFMEvent>('http://localhost:3000/events', event);
  }

  getEvents(): Observable<WFMEvent[]> {
    return this.http.get<WFMEvent[]>('http://localhost:3000/events');
  }

  getEventById(id: string): Observable<WFMEvent> {
    return this.http.get<WFMEvent>(`http://localhost:3000/events/${id}`);
  }

}
