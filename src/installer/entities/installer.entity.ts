import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Installer extends Document{
    @Prop({
        required: true,
        trim: true
    })
    companyName: string;

    @Prop({
        required: true,
        trim: true
    })
    phoneNumber: string;

    @Prop({
        required: true
    })
    IMSSNumber: number;

    @Prop({
        required: true,
        trim: true
    })
    website: string;

    @Prop({
        required: true
    })
    employeesNumber: number;

    @Prop({
        required: true
    })
    ownOffice: boolean;

    @Prop({
        required: true
    })
    ownVehicle: boolean;

    @Prop({
        required: true,
        trim: true
    })
    state: string;

    @Prop({
        required: true,
        trim: true
    })
    city: string;

    @Prop({
        required: true,
        trim: true
    })
    address: string;

    @Prop({
        required: true,
        trim: true
    })
    specializedTools: string;

    @Prop({
        required: true
    })
    yearsExperience: number;

    @Prop({
        required: true,
        trim: true
    })
    certifications: string;

    @Prop({
        required: true,
        trim: true
    })
    securityCourses: string;
}

export const InstallerSchema = SchemaFactory.createForClass(Installer)