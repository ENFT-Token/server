import { Inject, Logger } from '@nestjs/common';
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

interface MsgReq {
  roomId: string;
  msg: string;
  userName: string;
}

interface MsgRes {
  roomId: string;
  msg: string;
  userName: string;
  sendAt: string;
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
  // constructor(
  //   @InjectRepository(Chat)
  //   private chatRepository: Repository<Chat>,
  // ){}
  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  createChatRoom(client: Socket, roomId: string) {
    console.log(roomId);
    client.join(roomId);
  }

  @SubscribeMessage('join')
  enterChatRoom(client: Socket, roomId: string) {
    console.log(roomId);
    client.join(roomId);
  }


  @SubscribeMessage('leave')
  leaveChatRoom(client: Socket, roomId: string) {
    client.leave(roomId);
  }

  @SubscribeMessage('textMessage')
  onTextMessage(client: Socket, data: MsgReq) {
    const { msg, roomId, userName } = data;
    const date = new Date();
    var date_string = "";
    date_string += date.toLocaleDateString() + " " + date.getHours().toLocaleString() 
    + ":" + date.getMinutes().toLocaleString() + ":" + date.getSeconds().toLocaleString();
    date_string = date_string.replace(". ", "/");
    date_string = date_string.replace(". ", "/");
    date_string = date_string.replace(".", "");
    const res : MsgRes = {
      msg: msg,
      userName: userName,
      sendAt: date_string,
      roomId: roomId,
    }
    console.log(res)
    this.server.to(roomId).emit('textMessage', res);
  }

  @SubscribeMessage('imageMessage')
  onImageMessage(client: Socket, data: MsgReq) {
    const { msg, roomId, userName } = data;
    const res : MsgRes = {
      msg: msg,
      userName: userName,
      sendAt: new Date().toLocaleString(),
      roomId: roomId,
    }
    console.log(res)
    this.server.to(roomId).emit('imageMessage', res);
  }
}
