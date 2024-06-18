import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiHeaders, ApiBearerAuth } from '@nestjs/swagger';

import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @ApiBearerAuth('access-token')
  @Get()
  findOne(@Body() {userId}: {userId: string}) {
    return this.customerService.findOneByToken(userId);
  }

  @ApiBearerAuth('access-token')
  @Put()
  update(@Body() updateCustomerDto: UpdateCustomerDto) {

    return this.customerService.updateByToken(updateCustomerDto);
  }

  @ApiBearerAuth('access-token')
  @Delete()
  remove(@Body() {userId}: {userId: string}) {
    return this.customerService.removeByToken(userId);
  }
}
