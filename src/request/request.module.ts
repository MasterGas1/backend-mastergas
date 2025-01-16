import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Request, RequestSchema } from './entities/request.entity';

import { RequestService } from './request.service';
import { RequestController } from './request.controller';

import { UserModule } from '../user/user.module';
import { ServiceModule } from '../service/service.module';
import { RoleModule } from '../role/role.module';
import { NearInstallerModule } from '../near-installer/near-installer.module';

@Module({
  controllers: [RequestController],
  providers: [RequestService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Request.name,
        schema: RequestSchema,
      },
    ]),
    UserModule,
    ServiceModule,
    RoleModule,
    ServiceModule,
    NearInstallerModule,
  ],
  exports: [MongooseModule, RequestService],
})
export class RequestModule {}
