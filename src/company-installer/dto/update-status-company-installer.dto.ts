import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusCompanyInstallerInstallerDto {
    @ApiProperty()
    @IsEnum({pending: 'pending', approved: 'approved', rejected: 'rejected'})
    status: string;
}