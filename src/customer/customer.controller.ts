import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findOne(@Body() {userId}: {userId: string}) {
    return this.customerService.findOneByToken(userId);
  }

  @Put()
  update(@Body() updateCustomerDto: UpdateCustomerDto) {

    return this.customerService.updateByToken(updateCustomerDto);
  }

  @Delete()
  remove(@Body() {userId}: {userId: string}) {
    return this.customerService.removeByToken(userId);
  }
}
