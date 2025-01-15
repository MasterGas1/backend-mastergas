import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if the role already exists', async () => {
      const createDto: CreateRoleDto = { name: 'Admin' };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should create a new role', async () => {
      const createDto: CreateRoleDto = { name: 'User' };
      const result = { _id: 'newRoleId', name: 'User' };

      jest.spyOn(service, 'create').mockResolvedValue(result as Role);

      expect(await controller.create(createDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = [{ _id: 'roleId', name: 'Admin' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as Role[]);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw BadRequestException when given an invalid ID', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.findOne('invalidId')).rejects.toThrow(
        BadRequestException,
      );
      expect(service.findOne).toHaveBeenCalledWith('invalidId');
    });

    it('should return a role when given a valid ID', async () => {
      const result = { _id: 'roleId', name: 'Admin' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as Role);

      expect(await controller.findOne('roleId')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('roleId');
    });
  });

  describe('update', () => {
    it('should throw BadRequestException when updating with an invalid ID', async () => {
      const updateDto: UpdateRoleDto = { name: 'UpdatedRole' };
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.update('invalidId', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).toHaveBeenCalledWith('invalidId', updateDto);
    });

    it('should update a role when given a valid ID and DTO', async () => {
      const updateDto: UpdateRoleDto = { name: 'UpdatedRole' };
      const result = { _id: 'roleId', name: 'UpdatedRole' };
      jest.spyOn(service, 'update').mockResolvedValue(result as Role);

      expect(await controller.update('roleId', updateDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('roleId', updateDto);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException when given an invalid ID', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.remove('invalidId')).rejects.toThrow(
        BadRequestException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalidId');
    });

    it('should remove a role when given a valid ID', async () => {
      const result = {};
      jest.spyOn(service, 'remove').mockResolvedValue(result as Role);

      expect(await controller.remove('roleId')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith('roleId');
    });
  });
});
