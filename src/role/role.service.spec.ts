import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Role } from './entities/role.entity';

import { RoleService } from './role.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const roleModelModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnValue([]),
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('RoleService', () => {
  let service: RoleService;
  let model: Model<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: roleModelModel,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    model = module.get<Model<Role>>(getModelToken(Role.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw a BadRequestException if the role already exists', async () => {
      const createDto: CreateRoleDto = { name: 'Admin' };
      const mockExistingRole = { _id: 'existingRoleId', name: 'Admin' };

      jest.spyOn(model, 'findOne').mockResolvedValue(mockExistingRole as any);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(model.findOne).toHaveBeenCalledWith({ name: createDto.name });
      expect(model.create).not.toHaveBeenCalled();
    });
  });

  it('should create a new role', async () => {
    const createDto: CreateRoleDto = { name: 'User' };
    const mockCreatedRole = { _id: 'newRoleId', name: 'User' };

    jest.spyOn(model, 'findOne').mockResolvedValue(null);
    jest.spyOn(model, 'create').mockResolvedValue(mockCreatedRole as any);

    const result = await service.create(createDto);

    expect(result).toEqual(mockCreatedRole);
    expect(model.findOne).toHaveBeenCalledWith({ name: createDto.name });
    expect(model.create).toHaveBeenCalledWith(createDto);
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a role when given a valid ID', async () => {
      const mockRole = { _id: 'someId', name: 'Admin' };
      jest.spyOn(model, 'findById').mockResolvedValue(mockRole as Role);

      const result = await service.findOne('someId');
      expect(result).toEqual(mockRole);
      expect(model.findById).toHaveBeenCalledWith('someId');
    });

    it('should return NotFoundException when given an invalid ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findOne('invalidId')).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith('invalidId');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if the role does not exist', async () => {
      const updateDto: UpdateRoleDto = { name: 'UpdatedRole' };
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.update('invalidId', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith('invalidId');
    });

    it('should throw BadRequestException if the role name already exists', async () => {
      const updateDto: UpdateRoleDto = { name: 'ExistingRole' };
      const mockRole = { _id: 'existingRoleId', name: 'ExistingRole' };
      jest.spyOn(model, 'findById').mockResolvedValue(mockRole as Role);
      jest.spyOn(model, 'findOne').mockResolvedValue(mockRole as any);

      await expect(service.update('existingRoleId', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(model.findById).toHaveBeenCalledWith('existingRoleId');
      expect(model.findOne).toHaveBeenCalledWith({ name: updateDto.name });
    });

    it('should update the role if it exists and name is not taken', async () => {
      const updateDto: UpdateRoleDto = { name: 'UpdatedRole' };
      const mockRole = { _id: 'roleId', name: 'OldRole' };
      const mockUpdatedRole = { _id: 'roleId', name: 'UpdatedRole' };
      jest.spyOn(model, 'findById').mockResolvedValue(mockRole as Role);
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValue(mockUpdatedRole as Role);

      const result = await service.update('roleId', updateDto);
      expect(result).toEqual(mockUpdatedRole);
      expect(model.findById).toHaveBeenCalledWith('roleId');
      expect(model.findOne).toHaveBeenCalledWith({ name: updateDto.name });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'roleId',
        updateDto,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if the role does not exist', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.remove('invalidId')).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith('invalidId');
    });

    it('should delete the role if it exists', async () => {
      const mockRole = {
        _id: 'roleId',
        name: 'ExistingRole',
        deleteOne: jest.fn(),
      };
      jest.spyOn(model, 'findById').mockResolvedValue(mockRole as any);
      jest.spyOn(mockRole, 'deleteOne').mockResolvedValue({});

      const result = await service.remove('roleId');
      expect(result).toEqual({});
      expect(model.findById).toHaveBeenCalledWith('roleId');
      expect(mockRole.deleteOne).toHaveBeenCalled();
    });
  });
});
