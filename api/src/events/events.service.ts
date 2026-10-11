import { Injectable, NotFoundException } from '@nestjs/common';
import { EventItem } from '../types';
import { EventsQueryDto } from './dto/events.dto';
import { hasStarted } from '../common/helpers/time';
import { StoreService } from '../store/store.service';
import eventSortBy from '../common/helpers/eventSortBy';

@Injectable()
export class EventsService {
  constructor(private readonly store: StoreService) {}
  private readonly events: EventItem[] = this.store.events;
  findAll(filters: EventsQueryDto): EventItem[] {
    let filteredEvents: EventItem[] = this.store.events;
    const now = new Date();

    if (filters.availableOnly !== undefined && filters.availableOnly === true) {
      filteredEvents = filteredEvents.filter(
        (candidate) =>
          candidate.remaining > 0 && hasStarted(candidate, now) === false,
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
          ? hasStarted(candidate, now) === false
          : true,
      );
    } else {
      filteredEvents = filteredEvents.filter(
        (candidate) => hasStarted(candidate, now) === false,
      );
    }
    if (filters.sortBy !== undefined) {
      let asc = true;
      if (filters.asc !== undefined && filters.asc === false) asc = false;
      eventSortBy(filteredEvents, filters.sortBy, asc);
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
