import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString,  IsNotEmpty, IsNumber, ValidateNested, IsOptional } from "class-validator";

class CreateCoordsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()

    latitude:number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    longitude:number
}
export class CreateAddressDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    addressName:string
    
    @ApiProperty()
    @ValidateNested()
    @Type(() => CreateCoordsDto)
    coords:CreateCoordsDto

    @IsOptional()
    userId: string
}

