import { Injectable } from '@nestjs/common';
import { EventItem } from '../types';
import { seedEvents } from '../store/seed';

@Injectable()
export class EventsService {
  private readonly events: EventItem[] = seedEvents;
}
