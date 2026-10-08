import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { StoreModule } from './store/store.module';
@Module({
  imports: [EventsModule, BookingsModule, StoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
