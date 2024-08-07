import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InstallerService } from './installer.service';
import { InstallerController } from './installer.controller';
import { Installer, InstallerSchema } from './entities/installer.entity';

import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [InstallerController],
  providers: [InstallerService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Installer.name,
        schema: InstallerSchema
      }
    ]),

    RoleModule,

    UserModule
  ]
})
export class InstallerModule {}
