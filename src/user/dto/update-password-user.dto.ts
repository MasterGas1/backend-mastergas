import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePasswordUserDto {

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    userId ?: string
}