import { Body, Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('/:user1/:user2')
  async getChat(@Param('user1') user1: string, @Param('user2') user2: string) {
    return await this.eventsService.getAllChat(user1, user2);
  }

  @Get('/:user')
  async getChatRoom(@Param('user') user: string) {
    return await this.eventsService.getChatRooms(user);
  }
}
