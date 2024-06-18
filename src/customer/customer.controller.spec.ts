import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

import { User } from '../user/entities/user.entity';
import { RoleService } from '../role/role.service';

import { RoleModule } from '../role/role.module';
import { Role } from '../role/entities/role.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

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
    expect(serviceCustomer).toBeDefined();
    expect(roleService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createDto: CreateCustomerDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico'
      }
      const result = {
        name: 'John',
        lastName: 'Doe',
        token: 'token',
        role: 'Customer'
      }

      jest.spyOn(serviceCustomer, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createDto)).toEqual(result);
      expect(serviceCustomer.create).toHaveBeenCalledWith(createDto);
    })
  })

  describe('findOne', () => {
    it('should find a customer by token', async () => {
      const result = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        rfc: '123456789012',
        taxResidence: 'Mexico',
      }

      jest.spyOn(serviceCustomer, 'findOneByToken').mockResolvedValue(result as any);
      
      expect(await controller.findOne({userId: '123'})).toEqual(result);
    })
  })

  describe('update', () => {
    it('should update a customer by token', async () => {
      const result = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        rfc: '123456789012',
        taxResidence: 'Mexico',
      }
      

      jest.spyOn(serviceCustomer, 'updateByToken').mockResolvedValue(result as any);
      
      expect(await controller.update({userId: '123', name: 'UpdatedName'})).toEqual(result);
    })
  })

  describe('remove', () => {
    it('should delete a customer by token', async () => {
      const result = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        rfc: '123456789012',
        taxResidence: 'Mexico',
      }

      jest.spyOn(serviceCustomer, 'removeByToken').mockResolvedValue(result as any);
      
      expect(await controller.remove({userId: '123'})).toEqual(result);
    })
  })
});
