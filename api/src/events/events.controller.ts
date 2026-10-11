import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsQueryDto } from './dto/events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly EventsService: EventsService) {}

  @Get()
  findAll(@Query() dto: EventsQueryDto) {
    return this.EventsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.EventsService.findOne(id);
  }
}
