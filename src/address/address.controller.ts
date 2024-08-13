import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Address')

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  
  @ApiBearerAuth('access-token')
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @ApiBearerAuth('access-token')
  @Get()
  findAll(@Body() {userId}: {userId: string}) {
    return this.addressService.findAll(userId);
  }

  @ApiBearerAuth('access-token')
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.addressService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Put(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.addressService.remove(id);
  }
}
