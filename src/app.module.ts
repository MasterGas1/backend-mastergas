import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleModule } from './role/role.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      process.env.NODE_ENV === "test"
      ? `mongodb://localhost:27017/${process.env.DB_NAME_TEST}`
      : `mongodb://localhost:27017/${process.env.DB_NAME}`
    ),
    
    RoleModule,
    
    SeedModule
  ]
})


export class AppModule {}
