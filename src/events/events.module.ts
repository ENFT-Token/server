import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat/chat.entity';
import { ChatRoom } from './chat/chatRoom.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { User } from 'src/user/user.entity';

@Module({
  providers: [EventsGateway, EventsService],
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom, User])],
  controllers: [EventsController],
})
export class EventsModule {}
