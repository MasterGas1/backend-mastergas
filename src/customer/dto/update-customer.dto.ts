import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    userId: string
}
