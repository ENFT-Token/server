import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @OneToMany((type) => Chat, (chat) => chat.roomId, { eager: true })
  chat: Chat[];
}
