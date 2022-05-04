import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat/chat.entity';
import { ChatRoom } from './chat/chatRoom.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
    ){};

    async getAllChat(roomId: string){
        const chatRoom = this.chatRoomRepository.findOne({roomId});
        return chatRoom;

    }
}
