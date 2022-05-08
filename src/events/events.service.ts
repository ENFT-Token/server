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
        const roomIds = roomId.split(" ", 2);
        console.log(roomIds);
        const chatRoom1 = this.chatRoomRepository.findOne({roomId: roomIds[0] + " " + roomIds[1]});
        const chatRoom2 = this.chatRoomRepository.findOne({roomId: roomIds[1] + " " + roomIds[0]});
        if(chatRoom1) return chatRoom1;
        else if(chatRoom2) return chatRoom2;
        else return {s: 'noting'};
    }

    async getChatRooms(user: string){
        var data = await this.chatRepository
        .createQueryBuilder()
        .where({ name:`%${user}%` })
        .getMany();
        console.log(data);
    }
}
