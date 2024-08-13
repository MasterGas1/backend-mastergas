import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { InstallerService } from './installer.service';
import { CreateInstallerDto } from './dto/create-installer.dto';
import { UpdateInstallerDto } from './dto/update-installer.dto';
import { UpdateStatusInstallerDto } from './dto/update-status-installer.dto';

import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@ApiTags("Installer")
@Controller('installer')
export class InstallerController {
  constructor(private readonly installerService: InstallerService) {}

  @Post()
  create(@Body() createInstallerDto: CreateInstallerDto) {
    return this.installerService.create(createInstallerDto);
  }

  @Get()
  findAll(@Query('status') status: string) {
    return this.installerService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.installerService.findOne(id);
  }

  @Put('/status/:id')
  updateStatus(@Param('id', ParseMongoIdPipe) id: string, @Body() updateInstallerStatusDto: UpdateStatusInstallerDto) {
    return this.installerService.updateStatus(id, updateInstallerStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.installerService.remove(id);
  }
}
