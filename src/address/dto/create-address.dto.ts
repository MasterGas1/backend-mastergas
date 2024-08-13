import { Type } from "class-transformer";
import { IsString,  IsNotEmpty, IsNumber, ValidateNested, IsOptional } from "class-validator";

class CreateCoordsDto {
    @IsNotEmpty()
    @IsNumber()

    latitude:number

    @IsNotEmpty()
    @IsNumber()
    longitude:number
}
export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    addressName:string
    
    @ValidateNested()
    @Type(() => CreateCoordsDto)
    coords:CreateCoordsDto

    @IsOptional()
    userId: string
}

