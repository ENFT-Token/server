import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat/chat.entity';
import { ChatRoom } from './chat/chatRoom.entity';

@Module({
  providers: [EventsGateway],
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom])],
})
export class EventsModule {}
