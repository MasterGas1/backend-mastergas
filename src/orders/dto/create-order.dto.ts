import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    serviceId: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    installerId: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    customerUserId: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsOptional()
    status: string

    @IsDate()
    @IsOptional()
    createdAt: Date
}
