import { Injectable } from '@nestjs/common';
import { EventItem, Booking } from '../types';

@Injectable()
export class StoreService {
  events: EventItem[] = [];
  bookings: Booking[] = [];
}
