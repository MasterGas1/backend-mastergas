import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '../user/entities/user.entity';

import { Role } from '../role/entities/role.entity';

@Injectable()
export class CustomerService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    private readonly jwtTokenService: JwtService
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const {name, lastName, email, rfc, password} = createCustomerDto

    const role = await this.roleModel.findOne({name: 'Customer'});

    if (!role) {
      throw new NotFoundException('Execute seed first')
    }

    const isRepeatedRfc = await this.userModel.findOne({rfc});

    if(isRepeatedRfc) {
      throw new BadRequestException('El RFC ya existe')
    }

    const isEmailRepeated = await this.userModel.findOne({email, roleId: role._id});

    if(isEmailRepeated) {
      throw new BadRequestException('El correo ya existe')
    }

    const userBody = {
      ...createCustomerDto,
      roleId: role._id,
      password: bcrypt.hashSync(password, 10),
      status: 'approved'
    }

    const newUser = await this.userModel.create(userBody);

    const token = this.jwtTokenService.sign({id: newUser._id})

    return {name, lastName, token, role: role.name}

  }

  async findOneByToken(userId: string) {

    const role = await this.roleModel.findOne({name: 'Customer'});

    if (!role) {
      throw new NotFoundException('Execute seed first')
    }

    const user = await this.userModel.findOne({_id: userId, roleId: role._id});

    if(!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async updateByToken(updateCustomerDto: UpdateCustomerDto) {
    const {userId, ...updateCustomer} = updateCustomerDto;

    const role = await this.roleModel.findOne({name: 'Customer'});

    if (!role) {
      throw new NotFoundException('Execute seed first')
    }

    let user = await this.userModel.findOne({_id: userId, roleId: role._id});

    if(!user) {
      throw new NotFoundException('User not found')
    }
    const isEmailRepeated = await this.userModel.findOne({email: updateCustomer.email, roleId: role._id});

    if ( isEmailRepeated && updateCustomer.email !== undefined ) {
      throw new BadRequestException('El correo ya existe');
    }

    const isRfcRepeated = await this.userModel.findOne({rfc: updateCustomer.rfc});
    if ( isRfcRepeated && updateCustomer.rfc !== undefined ) {
      throw new BadRequestException('El RFC ya existe');
    }

    if (updateCustomerDto.password) {
      updateCustomer.password = bcrypt.hashSync(updateCustomerDto.password, 10);
    }

    user = await this.userModel.findOneAndUpdate({_id: userId, roleId: role._id}, updateCustomer, {new: true})
      .select('-password -roleId -status -createdAt -updatedAt -__v').exec();

    return user;
  }

  async removeByToken(userId: string) {

    const role = await this.roleModel.findOne({name: 'Customer'});

    if (!role) {
      throw new NotFoundException('Execute seed first')
    }

    let user = await this.userModel.findOne({_id: userId, roleId: role._id});

    if(!user) {
      throw new NotFoundException('User not found')
    }
    
    await this.userModel.findOneAndDelete({_id: userId, roleId: role._id});

    return {msg: 'Usuario eliminado'}
  }
}
