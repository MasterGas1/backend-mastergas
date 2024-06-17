import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role> //Access to the model
  ){}


  async create(createRoleDto: CreateRoleDto): Promise<Role | BadRequestException> {
      const roleExist = await this.roleModel.findOne({name: createRoleDto.name})
      
      if(roleExist) {
        throw new BadRequestException('Role ya existe')
      }
      
      return await this.roleModel.create(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.roleModel.find();

    return roles;
  }

  async findOne(id: string): Promise<Role | BadRequestException> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException('Role no existe')
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | BadRequestException> {
    const roleExist = await this.roleModel.findById(id);
    if (!roleExist) {
      throw new NotFoundException('Role no existe')
    }

    const roleRepeated = await this.roleModel.findOne({name: updateRoleDto.name})
    if(roleRepeated) {
      throw new BadRequestException('El nombre de rol ya existe')
    }

    const roleUptaded = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {new: true});

    return roleUptaded
  }

  async remove(id: string) {
    
    const category = await this.roleModel.findById(id);

    if (!category) {
      throw new NotFoundException('Role no existe')
    }

    await category.deleteOne();

    return {}
  }

  async removeAllCollections() {
    await this.roleModel.deleteMany({});
  }
}
