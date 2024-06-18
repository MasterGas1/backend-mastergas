import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    name: string

    @IsString()
    lastName: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string

    @IsString()
    @MinLength(12)
    @MaxLength(13)
    rfc: string

    @IsString()
    taxResidence: string
}
