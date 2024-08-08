import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './entities/service.entity';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Service.name,
        schema: ServiceSchema
      }
    ])
  ],
})
export class ServiceModule {}
