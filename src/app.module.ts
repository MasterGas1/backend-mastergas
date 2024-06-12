import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(`mongodb://localhost:27017/${process.env.DB_NAME}`),
    
    RoleModule
  ]
})
export class AppModule {}
