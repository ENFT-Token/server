import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(
        private eventsService: EventsService,
    ){};

    @Get()
    async getChat(@Param('roomId') roomId: string){
        return await this.eventsService.getAllChat(roomId);
    }
}
