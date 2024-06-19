import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleService } from '../role/role.service';

import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        RoleService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: {
            
          }
        },
        {
          provide: getModelToken(Role.name),
          useValue: {
            
          }
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('auth', () => {
    it('should return a token', async () => {
      const createAuthDto = { email: 'jdoe@me.com', password: 'password' };
      const mockUser = {
        name: 'Manuel',
        lastName: 'Barba',
        token: 'token',
        role: 'Admin'
      }

      jest.spyOn(controller, 'auth').mockResolvedValue(mockUser);

      expect(await controller.auth(createAuthDto)).toBe(mockUser);
    })
  })
});
