import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsObject, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

class CompanyInstallerDto {

    @ApiProperty()
    @IsString()
    companyName: string

    @ApiProperty({
        minLength: 10
    })
    @IsString()
    @MinLength(10)
    phoneNumber: string

    @ApiProperty({
        minLength: 10,
        maxLength: 12
    })
    @IsString()
    @MinLength(10)
    @MaxLength(12)
    IMSSNumber: string

    @ApiProperty()
    @IsNumber()
    employeesNumber: number

    @ApiProperty()
    @IsString()
    website: string

    @ApiProperty()
    @IsBoolean()
    ownOffice: boolean

    @ApiProperty()
    @IsBoolean()
    ownVehicle: boolean

    @ApiProperty()
    @IsString()
    state: string

    @ApiProperty()
    @IsString()
    city: string

    @ApiProperty()
    @IsString()
    address: string

    @ApiProperty()
    @IsString()
    specializedTools: string

    @ApiProperty()
    @IsNumber()
    yearsExperience: number

    @ApiProperty()
    @IsString()
    certifications: string

    @ApiProperty()
    @IsString()
    securityCourses: string
}

export class CreateCompanyInstallerInstallerDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty({
        minLength: 12,
        maxLength: 13
    })
    @IsString()
    @MinLength(12)
    @MaxLength(13)
    rfc: string

    @ApiProperty()
    @ValidateNested()
    @Type(() => CompanyInstallerDto)
    installer: CompanyInstallerDto

}

