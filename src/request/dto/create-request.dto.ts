import { Type } from "class-transformer"
import { IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"

class CreateCoordsDto {
    @IsNotEmpty()
    @IsNumber()
    latitude:number

    @IsNotEmpty()
    @IsNumber()
    longitude:number
}

export class CreateRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    serviceId: string

    @IsNotEmpty()
    @IsMongoId()
    customerId: string

    @IsNotEmpty()
    @IsString()
    addressName: string

    @ValidateNested()
    @Type(() => CreateCoordsDto)
    coordinates: CreateCoordsDto

}
