import { Module } from '@nestjs/common';
import { BookingsController } from './booking.controller';
import { BookingsService } from './bookings.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
