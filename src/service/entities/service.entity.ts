import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class Service extends Document{
    @Prop({
        type: String,
        trim: true,
        required: true
    })
    name: string

    @Prop({
        type: String,
        trim: true,
        required: true
    })
    description: string

    @Prop({
        type: String,
        trim: true,
        default: 'https://cdn0.iconfinder.com/data/icons/cosmo-layout/40/box-512.png'
    })
    image: string

    @Prop({
        type: String,
        trim: true,
        required: true,
        enum: ['root service', 'root service price', 'subservice', 'price']
    })
    type: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    })
    fatherServiceId: Service

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Service'
    })
    subservicesId: [Service]

    @Prop({
        type: Number
    })
    price: number

    @Prop({
        type: Boolean,
        default: true
    })
    available: boolean
}

export const ServiceSchema = SchemaFactory.createForClass(Service)
