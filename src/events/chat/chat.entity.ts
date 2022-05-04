import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chatRoom.entity";

@Entity()
export class Chat{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    msg: string;

    @Column()
    sendAt: Date;

    @Column()
    senderName: String;

    @ManyToOne((type) => ChatRoom, (chatroom) => chatroom.chat)
    roomId: ChatRoom;

}