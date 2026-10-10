import { Injectable } from '@nestjs/common';
import { EventItem, Booking } from '../types';
import { seedEvents, seedBookings } from './seed';

@Injectable()
export class StoreService {
  events: EventItem[] = seedEvents;
  bookings: Booking[] = seedBookings;
}
