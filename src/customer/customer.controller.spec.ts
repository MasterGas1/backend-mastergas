import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

import { User } from '../user/entities/user.entity';
import { RoleService } from '../role/role.service';

import { RoleModule } from '../role/role.module';
import { Role } from '../role/entities/role.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let serviceCustomer: CustomerService
  let roleService: RoleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
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

    controller = module.get<CustomerController>(CustomerController);
    serviceCustomer = module.get<CustomerService>(CustomerService)
    roleService = module.get<RoleService>(RoleService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
