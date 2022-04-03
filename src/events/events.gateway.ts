import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface IChatMsg {
  roomId: string;
  msg: string;
}

@WebSocketGateway(8080, { cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

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
  onTextMessage(client: Socket, data: IChatMsg) {
    const { msg, roomId } = data;
    this.server.to(roomId).emit('textMessage', msg);
  }

  @SubscribeMessage('imageMessage')
  onImageMessage(client: Socket, data: IChatMsg) {
    const { roomId, msg } = data;
    this.server.to(roomId).emit('imageMessage', msg);
  }
}
