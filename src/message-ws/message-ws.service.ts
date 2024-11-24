import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Socket } from 'socket.io';
import { Model } from 'mongoose';

import { User } from '../user/entities/user.entity';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error('User not found');

    this.checkUserConnection(user);

    this.connectedClients[client.id] = { socket: client, user };
  }

  async removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getOneClient(userId: string): any {
    const connectionClientValues = Object.values(this.connectedClients);
    const connectionClient = connectionClientValues.find(
      (value) => value.user._id.toString() === userId,
    );
    return connectionClient.socket;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectionClient = this.connectedClients[clientId];

      if (connectionClient.user._id.toString() === user._id.toString()) {
        connectionClient.socket.disconnect();
        break;
      }
    }
  }
}
