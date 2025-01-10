import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CompanyInstallerService } from './company-installer.service';
import { CreateCompanyInstallerInstallerDto } from './dto/create-company-installer.dto';
import { UpdateCompanyInstallerDto } from './dto/update-company-installer.dto';
import { UpdateStatusCompanyInstallerInstallerDto } from './dto/update-status-company-installer.dto';
import { UpdateCoordinatesInstallerDto } from './dto/update-coordinates-installer.dto';

import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@ApiTags("CompanyInstaller")
@Controller('company-installer')
export class CompanyInstallerController {
  constructor(private readonly CompanyInstallerService: CompanyInstallerService) {}

  @Post()
  create(@Body() createInstallerDto: CreateCompanyInstallerInstallerDto) {
    return this.CompanyInstallerService.create(createInstallerDto);
  }

  @Get()
  findAll(@Query('status') status: string) {
    return this.CompanyInstallerService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.CompanyInstallerService.findOne(id);
  }

  @Put('/status/:id')
  updateStatus(@Param('id', ParseMongoIdPipe) id: string, @Body() updateInstallerStatusDto: UpdateStatusCompanyInstallerInstallerDto) {
    return this.CompanyInstallerService.updateStatus(id, updateInstallerStatusDto);
  }

  @Put('/coordinates')
  updateCoordinatesByToken(@Body() updateCoordinatesInstallerDto: UpdateCoordinatesInstallerDto) {
    return this.CompanyInstallerService.updateCoordinatesByToken(updateCoordinatesInstallerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.CompanyInstallerService.remove(id);
  }
}
