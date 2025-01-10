import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

import { RoleModule } from './role/role.module';
import { SeedModule } from './seed/seed.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { validateAuthorizationMiddleware } from './common/middlewares/validateAuthorization.middleware';
import { AuthModule } from './auth/auth.module';
import { InstallerModule } from './installer/installer.module';
import { ServiceModule } from './service/service.module';
import { OrdersModule } from './orders/orders.module';
import { AddressModule } from './address/address.module';
import { validateTokenInEmailMiddleware } from './common/middlewares/validateTokenInEmail.middleware';
import { RequestModule } from './request/request.module';
import { NearInstallerModule } from './near-installer/near-installer.module';
import { MessageWsModule } from './message-ws/message-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRoot(
      process.env.NODE_ENV === 'test'
        ? `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER}.pzvdy2j.mongodb.net/${process.env.DB_NAME_TEST}`
        : `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER}.pzvdy2j.mongodb.net/${process.env.DB_NAME}`,
    ),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),

    RoleModule,

    SeedModule,

    UserModule,

    CustomerModule,

    AuthModule,

    InstallerModule,

    ServiceModule,

    OrdersModule,

    AddressModule,

    RequestModule,

    NearInstallerModule,

    MessageWsModule,
  ],

  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateAuthorizationMiddleware)
      .forRoutes(
        {
          path: '/user',
          method: RequestMethod.GET,
        },
        {
          path: '/customer',
          method: RequestMethod.GET,
        },
        {
          path: '/customer',
          method: RequestMethod.PUT,
        },
        {
          path: '/customer',
          method: RequestMethod.DELETE,
        },
        {
          path: '/installer/coordinates',
          method: RequestMethod.PUT,
        },
        {
          path: '/address',
          method: RequestMethod.POST,
        },
        {
          path: '/address',
          method: RequestMethod.PUT,
        },
        {
          path: '/address',
          method: RequestMethod.GET,
        },
        {
          path: '/address/:id',
          method: RequestMethod.GET,
        },
        {
          path: '/address/:id',
          method: RequestMethod.DELETE,
        },
        {
          path: '/request/all/installer/token',
          method: RequestMethod.GET,
        },
        {
          path: '/request/all/installer/token/:requestId',
          method: RequestMethod.GET,
        },
        {
          path: '/orders/firstOrderInstallerByToken',
          method: RequestMethod.GET,
        },
      )
      .apply(validateTokenInEmailMiddleware)
      .forRoutes(
        {
          path: '/user/changePasswordByTokenInEmail',
          method: RequestMethod.PUT,
        },
        {
          path: '/user/getUserStatusAndUpdateByToken',
          method: RequestMethod.GET,
        },
      );
  }
}
