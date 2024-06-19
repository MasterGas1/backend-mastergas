import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateAuthDto } from './dto/create-auth.dto';

import { User } from 'src/user/entities/user.entity';

import { Role } from 'src/role/entities/role.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModule: Model<Role>,

    private readonly jwtTokenService: JwtService
  ) {}

  async auth(createAuthDto: CreateAuthDto) {
    const {email, password} = createAuthDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Correo o contraseña incorrectos');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Correo o contraseña incorrectos');
    }

    const role = await this.roleModule.findById(user.roleId);

    const token = this.jwtTokenService.sign({id: user._id})

    return {name: user.name, lastName: user.lastName, token, role};
  }
}
