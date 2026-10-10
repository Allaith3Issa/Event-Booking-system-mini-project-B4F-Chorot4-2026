import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly EventsService: EventsService) {}

  @Get()
  findAll() {
    return this.EventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EventsService.findOne(Number(id));
  }
  @Get('category/:category')
  findCategory(@Param('category') category: string) {
    return this.EventsService.findCategory(category);
  }
}
