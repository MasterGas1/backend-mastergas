import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Coords extends Document {
  @Prop({
    required: true,
    trim: true,
    type: Number,
  })
  latitude: number;

  @Prop({
    required: true,
    trim: true,
    type: Number,
  })
  longitude: number;
}

@Schema()
export class Order extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Service.name,
    required: true,
  })
  serviceId: Service;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  installerId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  customerId: User;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    enum: ['finished', 'proccess', 'on the way'],
    default: 'proccess',
  })
  state: string;

  @Prop({
    type: String,
    required: true,
  })
  addressName: string;

  @Prop({
    type: Coords,
  })
  coordinates: Coords;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
