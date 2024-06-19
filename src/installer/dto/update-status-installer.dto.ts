import { rejects } from "assert";
import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusInstallerDto {
    @ApiProperty()
    @IsEnum({pending: 'pending', approved: 'approved', rejected: 'rejected'})
    status: string;
}