import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty({
        description: 'The email is unique',
    })
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'The password must have at least one uppercase letter, one lowercase letter and one number',
        minLength: 8
    })
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string


    @ApiProperty({
        description: 'The RFC is unique',
        minLength: 12,
        maxLength: 13
    })
    @MinLength(12)
    @MaxLength(13)
    rfc: string

    @ApiProperty()
    @IsString()
    taxResidence: string
}
