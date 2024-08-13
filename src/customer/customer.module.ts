import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

import { User, UserSchema } from '../user/entities/user.entity';
import { RoleModule } from '../role/role.module';


@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),

    RoleModule,

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY') || 'S3CR3TK3Y$',
        }
      }

    })
  ]
})
export class CustomerModule {}
