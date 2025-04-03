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
  onMessageFromClient(client: Socket, payload: NewMEssageDto) {
    console.log(client.id, payload);
  }

}
