import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.NODE_ENV === 'production' //Check if the system is in production mode with variables NODE
        ? `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER}.pzvdy2j.mongodb.net/${process.env.DB_NAME}` 
        : process.env.NODE_ENV === 'test' 
          ? `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER}.pzvdy2j.mongodb.net/${process.env.DB_NAME_TEST}`
          : `mongodb://localhost:27017/${configService.get('DB_NAME')}`,
      })
    }),
    
    RoleModule
  ]
})
export class AppModule {}
