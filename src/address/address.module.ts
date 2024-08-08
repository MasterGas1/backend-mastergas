import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './entities/address.entity';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Address.name,
        schema: AddressSchema
      }
    ])
  ]
})
export class AddressModule {}
