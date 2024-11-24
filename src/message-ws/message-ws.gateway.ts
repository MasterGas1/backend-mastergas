/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { MessageWsService } from './message-ws.service';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UpdateCoordinatesInstallerDto } from 'src/installer/dto/update-coordinates-installer.dto';
import { InstallerService } from 'src/installer/installer.service';
import { CreateRequestDto } from '../request/dto/create-request.dto';
import { RequestService } from 'src/request/request.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly installerService: InstallerService,
    private readonly requestService: RequestService,
    private readonly JwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string;
    let payload: JwtPayload;

    try {
      payload = this.JwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);

      console.log(`Client connected: ${client.id}`);
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);

    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('update-installer-coordinates')
  async onUpdateInstallerCoordinates(
    client: Socket,
    payload: UpdateCoordinatesInstallerDto,
  ) {
    try {
      await this.installerService.updateCoordinatesByToken(payload);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('create-request')
  async onCreateRequest(client: Socket, payload: CreateRequestDto) {
    try {
      const request = await this.requestService.create(payload);

      const installerSocket = this.messageWsService.getOneClient(
        request.installerId._id?.toString(),
      );

      this.wss.emit(installerSocket.id, request);
      this.wss.emit(client.id, request);
    } catch (error) {
      console.log(error);
    }
  }
}
