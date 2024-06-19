import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsObject, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

class InstallerDto {

    @IsString()
    companyName: string

    @IsString()
    @MinLength(10)
    phoneNumber: string

    @IsString()
    @MinLength(10)
    @MaxLength(12)
    IMSSNumber: string

    @IsNumber()
    employeesNumber: number

    @IsString()
    website: string

    @IsBoolean()
    ownOffice: boolean

    @IsBoolean()
    ownVehicle: boolean

    @IsString()
    state: string

    @IsString()
    city: string

    @IsString()
    address: string

    @IsString()
    specializedTools: string

    @IsNumber()
    yearsExperience: number

    @IsString()
    certifications: string

    @IsString()
    securityCourses: string
}

export class CreateInstallerDto {
    @IsString()
    name: string

    @IsString()
    lastName: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(12)
    @MaxLength(13)
    rfc: string

    @ValidateNested()
    @Type(() => InstallerDto)
    installer: InstallerDto

}

