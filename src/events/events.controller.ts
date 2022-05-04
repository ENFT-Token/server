import { Body, Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(
        private eventsService: EventsService,
    ){};

    @Get()
    async getChat(@Body('roomId') roomId: string){
        return await this.eventsService.getAllChat(roomId);
    }
}
