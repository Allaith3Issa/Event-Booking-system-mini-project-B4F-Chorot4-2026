import { Injectable, NotFoundException } from '@nestjs/common';
import { EventItem } from '../types';
import { EventsQueryDto } from './dto/events.dto';
import { hasStarted } from '../common/helpers/time';
import { StoreService } from '../store/store.service';
import { computeAvailability } from '../common/helpers/availability';
import eventSortBy from '../common/helpers/eventSortBy';

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
    if (filters.sortBy !== undefined) {
      let asc = true;
      if (filters.asc !== undefined && filters.asc === false) asc = false;
      eventSortBy(filteredEvents, filters.sortBy, asc);
    }
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
}
