import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

import { roles } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly roleService: RoleService,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>
  ) {}
  async runSeed() {
    await this.removeAllCollections();

    await this.roleModel.insertMany(roles);

    return 'Seed executed';
  }

  private async removeAllCollections() {
    await this.roleService.removeAllCollections();
  }

}
