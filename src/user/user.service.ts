import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  
  async findOneByToken(userId: string) {

    const user = (await this.userModel.findOne({_id: userId}).select('-password -status -__v -updatePassword -type -createdAt')).populate({
      path: 'roleId',
      select: '-_id'
    });

    if(!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async changePasswordByTokenInEmail(userId: string, password: string) {

    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== 'approved' || !user.updatePassword) {
      throw new BadRequestException('You can not change your password');
    }

    await this.userModel.findOneAndUpdate({_id: userId}, {password: bcrypt.hashSync(password, 10), updatePassword: false, status: 'active'});

    return {msg: 'Password updated'}
  }

  async getUserStatusAndUpdateByToken(userId: string) {

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {status: user.status, updatePassword: user.updatePassword}
  }

  removeAllColletions() {
    this.userModel.deleteMany({});
  }
}
