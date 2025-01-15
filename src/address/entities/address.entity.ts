import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/entities/user.entity';
@Schema()
export class Coords extends Document {
  @Prop({
    required: true,
    trim: true,
  })
  latitude: number;

  @Prop({
    required: true,
    trim: true,
  })
  longitude: number;
}
@Schema()
export class Address extends Document {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  addressName: string;

  @Prop({
    type: Coords,
  })
  coordinates: Coords;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: User;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
