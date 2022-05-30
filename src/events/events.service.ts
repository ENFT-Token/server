import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
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

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllChat(user1: string, user2: string) {
    const roomId1 = user1 + ' ' + user2;
    const roomId2 = user2 + ' ' + user1;
    const chatRoom1 = await this.chatRoomRepository.findOne({
      roomId: roomId1,
    });
    const chatRoom2 = await this.chatRoomRepository.findOne({
      roomId: roomId2,
    });
    if (chatRoom1) return chatRoom1;
    else if (chatRoom2) return chatRoom2;
    else return { return_value: 'noting' };
  }

  async getChatRooms(user: string) {
    const chatRooms = await this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .leftJoin(
        (qb) =>
          qb
            .from(Chat, 'chat')
            .select('max(sendAt)', 'sendAt')
            .addSelect('chat.roomId', 'roomId')
            .groupBy('chat.roomId'),
        'last_chat',
        'last_chat.roomId = chat_room.id',
      )
      .leftJoinAndSelect(
        'chat_room.chat',
        'chat',
        'chat.roomId = chat_room.id AND chat.sendAt = last_chat.sendAt',
      )
      .where('chat_room.roomId like :roomId', { roomId: `%${user}%` })
      .orderBy('chat.sendAt', 'DESC')
      .getMany();

    for (const chatRoom of chatRooms) {
      const otherUser = chatRoom.roomId.split(' ')[1];
      const user = await this.userRepository.findOne({
        nickname: otherUser,
      });
      (chatRoom as any).user = user;
    }

    return chatRooms;
  }
}
