import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface IChatMsg {
  roomId: string;
  msg: string;
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
