import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ServiceService } from './service.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ReponseServiceDto } from './dto/response-servide.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOkResponse({ type: ReponseServiceDto })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get('/rootServices')
  @ApiOkResponse({ type: [ReponseServiceDto] })
  findAllRootServices(@Query('available') available: string) {
    return this.serviceService.findAllRootServices(available);
  }

  @Get(':id')
  @ApiOkResponse({ type: ReponseServiceDto })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: ReponseServiceDto })
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.serviceService.remove(id);
  }
}
