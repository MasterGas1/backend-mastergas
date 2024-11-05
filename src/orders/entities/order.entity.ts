import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';
import { CompanyInstaller } from 'src/company-installer/entities/company-installer.entity';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Order extends Document {
    
    // @Prop({
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Service.name,
    //     required: true
    // })
    // serviceId: Service

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: CompanyInstaller.name,
        required: true
    })
    installerId: CompanyInstaller

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true
    })
    customerUserId: User

    price: number

    @Prop({
        enum: ['finished', 'proccess', 'on te way'],
        default: 'proccess'
    })
    state: string

    @Prop({
        default: Date.now
    })
    createdAt: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)
