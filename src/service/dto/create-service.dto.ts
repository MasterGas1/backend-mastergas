import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateServiceDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    description: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    image: string

    @ApiProperty()
    @IsString()
    @IsIn(['root service', 'root service price', 'subservice', 'price'])
    type: string

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    fatherServiceId: string

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price: number
}
