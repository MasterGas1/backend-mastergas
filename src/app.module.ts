import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleModule } from './role/role.module';
import { SeedModule } from './seed/seed.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { validateAuthorizationMiddleware } from './common/middlewares/validateAuthorization.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      process.env.NODE_ENV === "test"
      ? `mongodb://localhost:27017/${process.env.DB_NAME_TEST}`
      : `mongodb://localhost:27017/${process.env.DB_NAME}`
    ),
    
    RoleModule,
    
    SeedModule,
    
    UserModule,
    
    CustomerModule
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
        }
    );
  }
}
