import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Request } from '../../request/entities/request.entity';
import { User } from '../../user/entities/user.entity';

@Schema()
export class NearInstaller extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Request.name,
  })
  requestId: Request;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: User.name,
  })
  installersId: User[];
}

export const NearInstallerSchema = SchemaFactory.createForClass(NearInstaller);
