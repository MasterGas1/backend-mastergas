import { Module } from '@nestjs/common';
import { NearInstallerService } from './near-installer.service';
import { NearInstallerController } from './near-installer.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { NearInstaller, NearInstallerSchema } from './entities/near-installer.entity';

@Module({
  controllers: [NearInstallerController],
  providers: [NearInstallerService],
  imports: [
    MongooseModule.forFeature([{ 
      name: NearInstaller.name, 
      schema:  NearInstallerSchema
    }]),
  ],
  exports: [
    MongooseModule
  ],
})
export class NearInstallerModule {}
