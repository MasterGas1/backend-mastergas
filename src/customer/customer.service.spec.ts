import { Model, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import {JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';

import { CustomerService } from './customer.service';
import { RoleService } from '../role/role.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let roleService: RoleService
  let modelUser: Model<User>;
  let modelRole: Model<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        RoleService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn().mockImplementation(() => ({
              select: jest.fn().mockReturnThis(),
              exec: jest.fn(),
            })),
            findOneAndDelete: jest.fn()
          }
        },
        {
          provide: getModelToken(Role.name),
          useValue: {
            findOne: jest.fn()
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

    customerService = module.get<CustomerService>(CustomerService);
    roleService = module.get<RoleService>(RoleService);
    modelUser = module.get<Model<User>>(getModelToken(User.name));
    modelRole = module.get<Model<Role>>(getModelToken(Role.name));
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
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

      const mockCustomer = {
        name: 'John',
        lastName: 'Doe',
        token: 'token',
        role: 'Customer'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'create').mockResolvedValue(mockCustomer as any);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(null);
      
      const result = await customerService.create(createDto);

      expect(result).toEqual(mockCustomer);
    })

    it('should throw a BadRequestException if the customer RFC already exists', async () => {
      const createDto: CreateCustomerDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico'
      }
      
      const mockExistingCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockExistingCustomer as any);

      await expect(customerService.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw a NotFoundException if the role does not exist', async () => {
      const createDto: CreateCustomerDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(null);
      await expect(customerService.create(createDto)).rejects.toThrow(NotFoundException);
    })

    it('should throw a BadRequestException if the email already exists', async () => {
      const createDto: CreateCustomerDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico'
      }

      const mockExistingCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockExistingCustomer as any);
      
      await expect(customerService.create(createDto)).rejects.toThrow(BadRequestException);
    })
  })

  describe('findOneByToken', () => {
    it('should find a customer by token', async () => {
      const mockCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockCustomer as any);
      
      const result = await customerService.findOneByToken('123');

      expect(result).toEqual(mockCustomer);
    })

    it('should throw a NotFoundException if the customer does not exist', async () => {
      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(null);
      
      await expect(customerService.findOneByToken('123')).rejects.toThrow(NotFoundException);
    })

    it('should throw a NotFoundException if the role does not exist', async () => {
      jest.spyOn(modelRole, 'findOne').mockResolvedValue(null);
      await expect(customerService.findOneByToken('123')).rejects.toThrow(NotFoundException);
    })
  })

  describe('updateByToken', () => {
    it('should update a customer by token', async () => {
      const mockCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }


      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      const updatedCustomer = {
        ...mockCustomer,
        name: 'UpdatedName',
      };

      // Mock query chain
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedCustomer),
      };

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockCustomer as any);
      jest.spyOn(modelUser, 'findOneAndUpdate').mockReturnValue(mockQuery as unknown as Query<any, any>);
      
      const result = await customerService.updateByToken({userId: '123', name: 'UpdatedName' });

      expect(result).toEqual(updatedCustomer);
      expect(mockQuery.select).toHaveBeenCalledWith('-password -roleId -status -createdAt -updatedAt -__v');
      expect(mockQuery.exec).toHaveBeenCalled();
    })

    it('should throw a NotFoundException if the customer does not exist', async () => {
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(null);
      await expect(customerService.updateByToken({userId: '123', name: 'UpdatedName' })).rejects.toThrow(NotFoundException);
    })

    it('should throw a NotFoundException if the role does not exist', async () => {
      jest.spyOn(modelRole, 'findOne').mockResolvedValue(null);
      await expect(customerService.updateByToken({userId: '123', name: 'UpdatedName' })).rejects.toThrow(NotFoundException);
    })

    it('should throw a BadRequestException if the email already exists', async () => {
      const mockCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockCustomer as any);
      
      await expect(customerService.updateByToken({userId: '123', email: 'jdoe@me.com' })).rejects.toThrow(BadRequestException);
    })

    it('should throw a BadRequestException if the rfc already exists', async () => {
      const mockCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockCustomer as any);
      
      await expect(customerService.updateByToken({userId: '123', rfc: '123456789012' })).rejects.toThrow(BadRequestException);
    })
  })

  describe('removeByToken', () => {
    it('should delete a customer by token', async () => {
      const mockCustomer = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'password',
        rfc: '123456789012',
        taxResidence: 'Mexico',
        role: '12345'
      }

      const mockRole = {
        _id: '12345',
        name: 'Customer'
      }

      jest.spyOn(modelRole, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(mockCustomer as any);
      jest.spyOn(modelUser, 'findOneAndDelete').mockResolvedValue(mockCustomer as any);
      
      const result = await customerService.removeByToken('123');
      expect(result).toEqual({msg: "Usuario eliminado"});
    })

    it('should throw a NotFoundException if the customer does not exist', async () => {
      jest.spyOn(modelUser, 'findOne').mockResolvedValue(null);
      await expect(customerService.removeByToken('123')).rejects.toThrow(NotFoundException);
    })

    it('should throw a NotFoundException if the role does not exist', async () => {
      jest.spyOn(modelRole, 'findOne').mockResolvedValue(null);
      await expect(customerService.removeByToken('123')).rejects.toThrow(NotFoundException);
    })
  })
});
