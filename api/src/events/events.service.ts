import { Injectable, NotFoundException } from '@nestjs/common';
import { EventItem } from '../types';
import { seedEvents } from '../store/seed';

@Injectable()
export class EventsService {
  private readonly events: EventItem[] = seedEvents;
  private nextId: number = this.events.length + 1;
  findAll(): EventItem[] {
    return this.events;
  }
  findOne(id: number): EventItem {
    const event = this.events.find((candidate) => candidate.id === id);

    if (!event) {
      throw new NotFoundException(`No event found with id ${id}.`);
    }

    return event;
  }
  findCategory(category: string): EventItem[] {
    const eventsByCategory: EventItem[] = this.events.filter(
      (candidate) => candidate.category === category,
    );
    if (!eventsByCategory) {
      throw new NotFoundException(`No events found with category ${category}.`);
    }
    return eventsByCategory;
  }
}
