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

    async getAllChat(user1: string, user2: string){
        const roomId1 = user1 + " " + user2;
        const roomId2 = user2 + " " + user1;
        const chatRoom1 = await this.chatRoomRepository.findOne({roomId: roomId1});
        const chatRoom2 = await this.chatRoomRepository.findOne({roomId: roomId2});
        if(chatRoom1) return chatRoom1;
        else if(chatRoom2) return chatRoom2;
        else return {string: 'noting'};
    }

    async getChatRooms(user: string){
        const chatRooms = await this.chatRoomRepository
        .createQueryBuilder("chat_room")
        .where("chat_room.roomId like :roomId", { roomId:`%${user}%` })
        .getMany();
        return chatRooms;
    }
}
