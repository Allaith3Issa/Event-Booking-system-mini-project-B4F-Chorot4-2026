import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { StoreService } from '../store/store.service';
import { Booking, CreateBookingData } from '../types';
import { computeAvailability } from '../common/helpers/availability';
import { hasStarted } from '../common/helpers/time';

@Injectable()
export class BookingsService {
  constructor(private readonly store: StoreService) {}

  createBooking(bookingData: CreateBookingData): Booking {
    if (
      typeof bookingData.customerName !== 'string' ||
      !bookingData.customerName.trim()
    ) {
      throw new BadRequestException('Customer name is required');
    }

    if (
      typeof bookingData.customerPhone !== 'string' ||
      !bookingData.customerPhone.trim()
    ) {
      throw new BadRequestException('A valid phone number is required');
    }

    const normalizedPhone = this.normalizePhone(bookingData.customerPhone);

    if (!/^\+?[0-9]{8,15}$/.test(normalizedPhone)) {
      throw new BadRequestException('A valid phone number is required');
    }

    if (
      !Number.isInteger(bookingData.places) ||
      bookingData.places < 1 ||
      bookingData.places > 4
    ) {
      throw new BadRequestException(
        'Places must be a whole number between 1 and 4',
      );
    }

    const eventId = bookingData.eventId;

    if (!Number.isInteger(eventId) || eventId <= 0) {
      throw new NotFoundException('Event not found');
    }

    const event = this.store.events.find((item) => item.id === eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const now = new Date();

    if (hasStarted(event, now)) {
      throw new ConflictException(
        'This event has already started and can no longer be booked',
      );
    }

    const availability = computeAvailability(event, this.store.bookings, now);

    if (availability.status === 'Full') {
      throw new ConflictException('This event is full');
    }

    if (availability.remaining < bookingData.places) {
      throw new ConflictException(
        `Only ${availability.remaining} places remain for this event`,
      );
    }

    const existingBooking = this.store.bookings.find(
      (booking) =>
        booking.eventId === eventId &&
        this.normalizePhone(booking.customerPhone) === normalizedPhone &&
        booking.status === 'Active',
    );

    if (existingBooking) {
      throw new ConflictException(
        'You already have an active booking for this event',
      );
    }

    const bookingCode = this.generateBookingCode();

    const maxBookingId = Math.max(
      0,
      ...this.store.bookings.map((booking) => booking.id),
    );

    const newBooking: Booking = {
      id: maxBookingId + 1,
      code: bookingCode,
      eventId,
      event,
      customerName: bookingData.customerName.trim(),
      customerPhone: normalizedPhone,
      places: bookingData.places,
      bookedAt: now.toISOString(),
      status: 'Active',
      canCancel: true,
    };

    this.store.bookings.push(newBooking);

    const updatedAvailability = computeAvailability(
      event,
      this.store.bookings,
      now,
    );

    Object.assign(event, updatedAvailability);

    return newBooking;
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[\s-]/g, '');
  }

  private generateBookingCode(): string {
    const existingCodes = new Set(
      this.store.bookings.map((booking) => booking.code.toUpperCase()),
    );

    const usedFourDigitCodes = [...existingCodes].filter((code) =>
      /^EV-[0-9]{4}$/.test(code),
    ).length;

    if (usedFourDigitCodes >= 9000) {
      let code: string;

      do {
        code = `EV-${Math.floor(Math.random() * 90000) + 10000}`;
      } while (existingCodes.has(code));

      return code;
    }

    let code: string;

    do {
      code = `EV-${Math.floor(Math.random() * 9000) + 1000}`;
    } while (existingCodes.has(code));

    return code;
  }

  findBooking(phone: string, code: string): Booking {
    const normalizedPhone =
      typeof phone === 'string' ? this.normalizePhone(phone) : '';

    const normalizedCode =
      typeof code === 'string' ? code.trim().toUpperCase() : '';

    const booking = this.store.bookings.find(
      (item) =>
        normalizedPhone !== '' &&
        normalizedCode !== '' &&
        this.normalizePhone(item.customerPhone) === normalizedPhone &&
        item.code.toUpperCase() === normalizedCode,
    );

    if (!booking) {
      throw new NotFoundException(
        'Booking not found. Check your phone number and booking code',
      );
    }

    const event = this.store.events.find((item) => item.id === booking.eventId);

    if (event) {
      booking.event = event;
      booking.canCancel =
        booking.status === 'Active' && !hasStarted(event, new Date());
    } else {
      booking.canCancel = false;
    }

    return booking;
  }

  cancelBooking(id: number | string, phone: string): Booking {
    const bookingId = Number(id);

    const normalizedPhone =
      typeof phone === 'string' ? this.normalizePhone(phone) : '';

    const booking = this.store.bookings.find(
      (item) =>
        Number.isInteger(bookingId) && bookingId > 0 && item.id === bookingId,
    );

    if (
      !booking ||
      !normalizedPhone ||
      this.normalizePhone(booking.customerPhone) !== normalizedPhone
    ) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'Cancelled') {
      throw new ConflictException('This booking is already cancelled');
    }

    const event = this.store.events.find((item) => item.id === booking.eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const now = new Date();

    if (hasStarted(event, now)) {
      throw new ConflictException(
        'This booking can no longer be cancelled because the event has started',
      );
    }

    booking.status = 'Cancelled';
    booking.cancelledAt = now.toISOString();
    booking.canCancel = false;

    const updatedAvailability = computeAvailability(
      event,
      this.store.bookings,
      now,
    );

    Object.assign(event, updatedAvailability);
    booking.event = event;

    return booking;
  }
}
