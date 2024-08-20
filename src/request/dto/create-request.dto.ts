import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator"

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
    installerUserId: string
}
