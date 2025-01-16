import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';

import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

import { roles, userAdmin } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async runSeed() {
    await this.removeAllCollections();

    await this.roleModel.insertMany(roles);

    await this.insertAdmin();

    return 'Seed executed';
  }

  private async removeAllCollections() {
    await this.roleService.removeAllCollections();
  }

  private async insertAdmin() {
    const role = await this.roleModel.findOne({ name: 'Administrator' });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const getUserAdmin = await this.userModel.findOne({
      email: userAdmin.email,
    });

    if (getUserAdmin) {
      await this.userModel.findOneAndDelete({ email: userAdmin.email });
    }

    userAdmin.password = hashSync(userAdmin.password, 10);
    userAdmin.roleId = role._id;

    await this.userModel.create(userAdmin);
  }
}
