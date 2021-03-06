import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Chat } from './chat/chat.entity';
import { ChatRoom } from './chat/chatRoom.entity';

interface MsgReq {
  roomId: string;
  msg: string;
  userName: string;
}

interface MsgRes {
  roomId: string;
  msg: string;
  userName: string;
  sendAt: Date;
}

interface SocketUsers{
  client: Socket;
  user: any;
}


@WebSocketGateway(8080, {
  path: '/chat',
  cors: true,
  transports: ['websocket'],
  autoConnect: false,
  forceNew: true,
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ){}
  private socketusers: SocketUsers[] = [];
  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.socketusers = this.socketusers.filter(socketusers => socketusers.client !== client);
    this.logger.log(`Client disconnected: ${client.id}`);

  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    this.socketusers.push({
      client,
      user: client.handshake.query.nickname,
    })
    console.log(this.socketusers)
  }
  

  @SubscribeMessage('createRoom')
  createChatRoom(client: Socket, roomId: string) {
    this.roomSave(roomId);
    console.log(roomId);
    client.join(roomId);
  }

  async roomSave(roomId: string){
    const users = roomId.split(" ", 2);
    const roomId1 = users[0] + " " + users[1];
    const roomId2 = users[1] + " " + users[0];
    const isExist1 = await this.chatRoomRepository.findOne({roomId: roomId1});
    const isExist2 = await this.chatRoomRepository.findOne({roomId: roomId2});
    var realRoomId: string;
    if(!isExist1){
      if(!isExist2){
        realRoomId = roomId;
      }else realRoomId = roomId2;
    }else realRoomId = roomId1;
    if(!isExist1 && !isExist2){
      const new_room = await this.chatRoomRepository.create({
        roomId,
      })
      try {
        await this.chatRoomRepository.save(new_room);
      } catch (error) {
        console.log(error)
      }
    }
    return realRoomId;
    
  }

  @SubscribeMessage('join')
  enterChatRoom(client: Socket, roomId: string) {
    console.log(roomId);
    client.join(roomId);
    const users = roomId.split(" ", 2);
    const otherClient = this.socketusers.find(socketusers =>socketusers.user === users[1]);
    console.log(otherClient.user)
    if(otherClient){
      otherClient.client.join(roomId);
    }
  }


  @SubscribeMessage('leave')
  leaveChatRoom(client: Socket, roomId: string) {
    
    client.leave(roomId);
  }

  @SubscribeMessage('textMessage')
  onTextMessage(client: Socket, data: MsgReq) {
    const { msg, roomId, userName } = data;
    const date = new Date();
    this.msgSave(data, date);
    const res : MsgRes = {
      msg: msg,
      userName: userName,
      sendAt: date,
      roomId: roomId,
    }
    console.log(res)
    client.broadcast.emit('textMessage', res);
  }

  async msgSave(data: MsgReq, date: Date){
    const { msg, roomId, userName } = data;
    const chatRoomId = await this.roomSave(roomId);
    const chatRoom = await this.chatRoomRepository.findOne({roomId: chatRoomId});
    const new_chat = this.chatRepository.create({
      msg: msg,
      sendAt: date,
      senderName: userName,
      roomId: chatRoom,
    });
    this.chatRepository.save(new_chat);
  }

  @SubscribeMessage('imageMessage')
  onImageMessage(client: Socket, data: MsgReq) {
    const { msg, roomId, userName } = data;
    
    const res : MsgRes = {
      msg: msg,
      userName: userName,
      sendAt: new Date(),
      roomId: roomId,
    }
    console.log(res)
    this.server.to(roomId).emit('imageMessage', res);
  }
}
