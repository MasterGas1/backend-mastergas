import mongoose, { Document, mongo } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Role } from "../../role/entities/role.entity";
import { CompanyInstaller } from "../../company-installer/entities/company-installer.entity";

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    lastName: string

    @Prop({
        default: ''
    })
    rfc: string

    @Prop({
        default: ''
    })
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
        default: 5,
        type: Number
    })
    score: number

    @Prop({
        enum: ['pending', 'approved','rejected' ,'blocked', 'active'],
    })
    status: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Role.name,
        required: true
    })
    roleId: Role

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: CompanyInstaller.name,
    })
    installerId: CompanyInstaller

    @Prop({
        type: { type: String, enum: ['Point'], default: 'Point' }, // GeoJSON type "Point"
    })
    type: string;

    @Prop({
        type: [Number],
        default: [0,0]
    })
    coordinates: []

    @Prop({
        default: false
    })
    updatePassword: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ coordinates: '2dsphere' })
