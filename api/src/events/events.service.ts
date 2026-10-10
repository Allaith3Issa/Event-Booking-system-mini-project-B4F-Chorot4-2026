import { Injectable, NotFoundException } from '@nestjs/common';
import { EventItem } from '../types';
import { EventsQueryDto } from './dto/events.dto';
import { hasStarted } from '../common/helpers/time';
import { StoreService } from '../store/store.service';
import { computeAvailability } from '../common/helpers/availability';

@Injectable()
export class EventsService {
  constructor(private readonly store: StoreService) {}
  private readonly events: EventItem[] = this.store.events;
  private readonly now: Date = new Date();

  findAll(filters: EventsQueryDto): EventItem[] {
    let filteredEvents: EventItem[] = this.store.events;

    if (filters.availableOnly !== undefined && filters.availableOnly === true) {
      filteredEvents = filteredEvents.filter(
        (candidate) =>
          computeAvailability(candidate, this.store.bookings, this.now) !==
          null,
      );
    }
    if (filters.category !== undefined) {
      filteredEvents = filteredEvents.filter(
        (candidate) => candidate.category === filters.category,
      );
    }
    if (filters.date !== undefined) {
      filteredEvents = filteredEvents.filter(
        (candidate) => candidate.date === filters.date,
      );
    }
    if (filters.includePast !== undefined) {
      filteredEvents = filteredEvents.filter((candidate) =>
        filters.includePast === false
          ? hasStarted(candidate, this.now) === false
          : true,
      );
    }
    filteredEvents.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;

      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;

      return 0;
    });
    if (!filteredEvents.length) {
      throw new NotFoundException('No events found');
    }
    return filteredEvents;
  }
  findOne(id: number): EventItem {
    const event = this.store.events.find((candidate) => candidate.id === id);

    if (!event) {
      throw new NotFoundException(`No event found with id ${id}.`);
    }

    return event;
  }
  findCategory(category: string): EventItem[] {
    const eventsByCategory: EventItem[] = this.store.events.filter(
      (candidate) => candidate.category === category,
    );
    if (!eventsByCategory) {
      throw new NotFoundException(`No events found with category ${category}.`);
    }
    return eventsByCategory;
  }
}
