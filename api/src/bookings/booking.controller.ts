import { Body, Controller, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }

  @Post('find')
  findBooking(@Body('phone') phone: string, @Body('code') code: string) {
    return this.bookingsService.findBooking(phone, code);
  }

  @Post(':id/cancel')
  cancelBooking(@Param('id') id: string, @Body('phone') phone: string) {
    return this.bookingsService.cancelBooking(id, phone);
  }
}
