import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {

    @IsOptional()
    available: boolean
}
