import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NearInstallerService } from './near-installer.service';
import { CreateNearInstallerDto } from './dto/create-near-installer.dto';
import { UpdateNearInstallerDto } from './dto/update-near-installer.dto';

@Controller('near-installer')
export class NearInstallerController {
  constructor(private readonly nearInstallerService: NearInstallerService) {}

  @Post()
  create(@Body() createNearInstallerDto: CreateNearInstallerDto) {
    return this.nearInstallerService.create(createNearInstallerDto);
  }

  @Get()
  findAll() {
    return this.nearInstallerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nearInstallerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNearInstallerDto: UpdateNearInstallerDto) {
    return this.nearInstallerService.update(+id, updateNearInstallerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nearInstallerService.remove(+id);
  }
}
