import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RequestService } from './request.service';
import { RequestController } from './request.controller';

import { Request, RequestSchema } from './entities/request.entity';

@Module({
  controllers: [RequestController],
  providers: [RequestService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Request.name,
        schema: RequestSchema
      }
    ])
  ]
})
export class RequestModule {}
