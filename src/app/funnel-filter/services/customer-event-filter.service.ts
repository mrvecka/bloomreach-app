import { Injectable, signal } from '@angular/core';
import { UserEvent } from '../event-filter.types';

export const availableOperators = [
  { value: 'equal', viewValue: 'equal to', type: 'number' },
  { value: 'less_than', viewValue: 'less than', type: 'number' },
  { value: 'greater_than', viewValue: 'greater than', type: 'number' },
  { value: 'between', viewValue: 'in between', type: 'number' },
  { value: 'equals', viewValue: 'equals', type: 'string' },
  { value: 'does_not_equals', viewValue: 'does not equal', type: 'string' },
  { value: 'contains', viewValue: 'contains', type: 'string' },
  {
    value: 'does_not_contain',
    viewValue: 'does not contain',
    type: 'string',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CustomerEventFilterService {
  userEvents = signal<UserEvent[]>([]);

  constructor() {
    fetch('https://br-fe-assignment.github.io/customer-events/events.json')
      .then(async (response) => {
        const data = await response.json();
        this.userEvents.set(data.events);
      })
      .catch((error) => {
        console.log(error);
        this.userEvents.set([]);
      });
  }
}
