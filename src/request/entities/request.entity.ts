import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Service } from '../../service/entities/service.entity';
import { User } from '../../user/entities/user.entity';

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
export class Request extends Document {
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
    type: String,
    required: true,
  })
  addressName: string;

  @Prop({
    type: Coords,
  })
  coordinates: Coords;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
