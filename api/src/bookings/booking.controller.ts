import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }

  @Get('find')
  findBooking(@Query('phone') phone: string, @Query('code') code: string) {
    return this.bookingsService.findBooking(phone, code);
  }

  @Patch(':id/cancel')
  cancelBooking(@Param('id') id: string, @Body('phone') phone: string) {
    return this.bookingsService.cancelBooking(id, phone);
  }
}
