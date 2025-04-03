import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {};

    registerClient (client: Socket, id: string) {
        this.connectedClients[client.id] = client;
    }

    removeClient (clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedclients(): string[] {
        return Object.keys(this.connectedClients);
    }
}
