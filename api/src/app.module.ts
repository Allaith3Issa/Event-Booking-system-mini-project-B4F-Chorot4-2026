import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
      },
    }),
    EventsModule,
    BookingsModule,
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
