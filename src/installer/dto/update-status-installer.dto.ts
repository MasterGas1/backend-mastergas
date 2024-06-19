import { rejects } from "assert";
import { IsEnum } from "class-validator";

export class UpdateStatusInstallerDto {
    @IsEnum({pending: 'pending', approved: 'approved', rejected: 'rejected'})
    status: string;
}