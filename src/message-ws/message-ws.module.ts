import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MessageWsService } from './message-ws.service';
import { MessageWsGateway } from './message-ws.gateway';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { InstallerModule } from 'src/installer/installer.module';
import { RequestModule } from 'src/request/request.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  providers: [MessageWsGateway, MessageWsService],
  imports: [
    UserModule,
    InstallerModule,
    AuthModule,
    RequestModule,
    OrdersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY') || 'S3CR3TK3Y$',
        };
      },
    }),
  ],
})
export class MessageWsModule {}
