import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat/chat.entity';
import { ChatRoom } from './chat/chatRoom.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  providers: [EventsGateway, EventsService],
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom])],
  controllers: [EventsController],
})
export class EventsModule {}
