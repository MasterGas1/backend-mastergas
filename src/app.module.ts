import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
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
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      process.env.NODE_ENV === "test"
      ? `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER}.pzvdy2j.mongodb.net/${process.env.DB_NAME_TEST}`
      : `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER}.pzvdy2j.mongodb.net/${process.env.DB_NAME}`
    ),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      }
    }),
    
    RoleModule,
    
    SeedModule,
    
    UserModule,
    
    CustomerModule,
    
    AuthModule,
    
    InstallerModule,
    
    AddressModule
  ],

  providers: [
    JwtService
  ]
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(validateAuthorizationMiddleware)
      .forRoutes(
        {
          path: '/customer',
          method: RequestMethod.GET
        },
        {
          path: '/customer',
          method: RequestMethod.PUT
        },
        {
          path: '/customer',
          method: RequestMethod.DELETE
        },
        {
          path: '/address',
          method: RequestMethod.POST
        },
        {
          path: '/address',
          method: RequestMethod.PUT
        },
        {
          path: '/address',
          method: RequestMethod.GET
        },
        {
          path: '/address/:id',
          method: RequestMethod.GET
        },
        {
          path: '/address/:id',
          method: RequestMethod.DELETE
        }
    );
  }
}
