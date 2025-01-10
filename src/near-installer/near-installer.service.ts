import { Injectable } from '@nestjs/common';
import { CreateNearInstallerDto } from './dto/create-near-installer.dto';
import { UpdateNearInstallerDto } from './dto/update-near-installer.dto';

@Injectable()
export class NearInstallerService {
  create(createNearInstallerDto: CreateNearInstallerDto) {
    return 'This action adds a new nearInstaller';
  }

  findAll() {
    return `This action returns all nearInstaller`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nearInstaller`;
  }

  update(id: number, updateNearInstallerDto: UpdateNearInstallerDto) {
    return `This action updates a #${id} nearInstaller`;
  }

  remove(id: number) {
    return `This action removes a #${id} nearInstaller`;
  }
}
