import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

import { Service } from "src/service/entities/service.entity";
import { User } from "src/user/entities/user.entity";

@Schema()
export class Coords extends Document {
    @Prop({
        required: true,
        trim: true
    })
    latitude: number;
 
    @Prop({
        required: true,
        trim: true
    })
    longitude: number;
}

@Schema()
export class Request extends Document{
    @Prop({
        type: mongoose.Types.ObjectId,
        ref: Service.name,
        required: true,
    })
    serviceId: string

    @Prop({
        type: mongoose.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    customerUserId: string

    @Prop({
        type: mongoose.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    installerUserId: string

    @Prop({
        required: true,
        trim: true,
    })
    addressName: string

    @Prop({
        type: mongoose.Schema.Types.Mixed,
        required: true
    })
    coords: Coords

    @Prop({
        default: Date.now
    })
    createdAt: Date

    @Prop({
        enum: ['peding', 'acceepted', 'on going', 'completed', 'canceled'],
    })
    status: string   
}

export const RequestSchema = SchemaFactory.createForClass(Request);


