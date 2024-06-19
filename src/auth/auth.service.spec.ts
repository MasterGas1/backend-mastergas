import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

import { Role } from '../role/entities/role.entity';

describe('AuthService', () => {
  let service: AuthService;
  let modelUser: Model<User>
  let modelRole: Model<Role>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn()
          }
        },
        {
          provide: getModelToken(Role.name),
          useValue: {
            findById: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token')
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    modelUser = module.get<Model<User>>(getModelToken(User.name))
    modelRole = module.get<Model<Role>>(getModelToken(Role.name))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(modelUser).toBeDefined()
  });

  describe('auth', () => {
    it('should return an access token', async () => {
      const mockUser = {
        _id: '12345',
        name: 'Manuel',
        lastName: 'Barba',
        email: 'jdoe@me.com',
        password: '12345',
      }

      const mockRole = {
        _id: '12345',
        name: 'Admin'
      }



      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(modelRole, 'findById').mockResolvedValue(mockRole as Role);
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);


      const result = await service.auth({email: 'jdoe@me.com', password: 'password'});

      expect(result).toEqual({name: 'Manuel', lastName: 'Barba', token: 'token', role: 'Admin'});

    })

    it('should throw BadRequestException if password is incorrect', async () => {
      const mockUser = {
        _id: '12345',
        name: 'Manuel',
        lastName: 'Barba',
        email: 'jdoe@me.com',
        password: '12345',
      }

      const mockRole = {
        _id: '12345',
        name: 'Admin'
      }


      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(modelRole, 'findById').mockResolvedValue(mockRole as Role);
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => false);


      await expect(service.auth({email: 'jdoe@me.com', password: 'password'})).rejects.toThrow(BadRequestException);
    })

    it('should throw BadRequestException if the email does not exist', async () => {
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(null);
      await expect(service.auth({email: 'jdoe@me.com', password: 'password'})).rejects.toThrow(BadRequestException);
    })
  })
});
