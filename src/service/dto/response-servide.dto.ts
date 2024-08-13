import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsUUID } from "class-validator";

export class ReponseServiceDto {
    
    @ApiProperty()
    @IsUUID()
    _id: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    description: string

    @ApiProperty()
    @IsBoolean()
    available: boolean
}