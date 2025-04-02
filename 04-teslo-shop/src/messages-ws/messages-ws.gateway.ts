import { WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway {
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log(`Cliente conectado: ${client.id}`);
    this.messagesWsService.registerClient(client);

    // console.log({ conectados: this.messagesWsService.getConnectedclients()});
  }

  handleDisconnect(client: Socket) {
    // console.log(`Cliente desconectado: ${client.id}`);
    this.messagesWsService.removeClient(client.id);
  }
}
