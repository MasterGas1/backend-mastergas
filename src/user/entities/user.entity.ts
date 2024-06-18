import mongoose, { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Role } from "../../role/entities/role.entity";

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    lastName: string

    @Prop({ required: true })
    rfc: string

    @Prop({ required: true })
    taxResidence: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ 
        default: 'https://res.cloudinary.com/dnesdnfxy/image/upload/v1700172676/mastergas23/users/nrtsecwphzvysmcddswx.png'    
    })
    picture: string

    @Prop({
        default: Date.now()
    })
    createdAt: Date

    @Prop({
        enum: ['pending', 'approved', 'denied'],
    })
    status: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Role.name
    })
    roleId: Role
}

export const UserSchema = SchemaFactory.createForClass(User)
