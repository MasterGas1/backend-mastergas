import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Order',
        schema: OrderSchema
      }
    ]),
    UserModule,
    RoleModule
  ]
})
export class OrdersModule {}
