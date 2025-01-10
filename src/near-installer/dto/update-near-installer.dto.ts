import { PartialType } from '@nestjs/swagger';
import { CreateNearInstallerDto } from './create-near-installer.dto';

export class UpdateNearInstallerDto extends PartialType(CreateNearInstallerDto) {}
