import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    RoleModule,
    UserModule
  ]
})
export class SeedModule {}
