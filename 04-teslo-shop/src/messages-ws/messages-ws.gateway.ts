import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMEssageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway {

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log(`Cliente conectado: ${client.id}`);
    this.messagesWsService.registerClient(client);

    // client.broadcast
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedclients());
  }

  handleDisconnect(client: Socket) {
    // console.log(`Cliente desconectado: ${client.id}`);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedclients());
  }

  @SubscribeMessage('message-form-client')
  async onMessageFromClient(client: Socket, payload: NewMEssageDto) {
    // client.emit emite mensaje solo al cliente
    // client.emit('message-from-server', {
    //   fullName: 'soyyo!',
    //   message: payload.message || 'no message'
    // });

    // emitir a todos menos al cliente que envía el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'soyyo!',
    //   message: payload.message || 'no message'
    // });

    // enviar mensajes a todos
    this.wss.emit('message-from-server', {
      fullName: 'soyyo!',
      message: payload.message || 'no message'
    });
  }

}
