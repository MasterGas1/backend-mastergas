import { PartialType } from '@nestjs/swagger';
import { CreateCompanyInstallerInstallerDto } from './create-company-installer.dto';

export class UpdateCompanyInstallerDto extends PartialType(CreateCompanyInstallerInstallerDto) {}
