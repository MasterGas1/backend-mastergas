import { Model, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceService } from './service.service';
import { Service } from './entities/service.entity';


describe('ServiceService', () => {
  let service: ServiceService;
  let modelService: Model<Service>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: getModelToken(Service.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    modelService = module.get<Model<Service>>(getModelToken(Service.name))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(modelService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new root service', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'root service',
        description: 'Description 1',
        image: null,
        fatherServiceId: null,
        price: null
      }

      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        available: true
      }

      jest.spyOn(modelService, 'create').mockResolvedValue(mockService as any);

      await expect(await service.create(createDto)).toEqual(mockService);
    })
    
    it('should create a new sub service', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }
  
      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        available: true
      }
  
      const mockFatherService = {
        _id: '123',
        name: 'Service 2',
        description: 'Description 1',
        available: true
      }
  
      jest.spyOn(modelService, 'create').mockResolvedValue(mockService as any);
      jest.spyOn(modelService, 'findById').mockResolvedValue(mockFatherService as any);
  
      await expect(await service.create(createDto)).toEqual(mockService);
    })
  
    it('should create a new price service', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'price',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: 100
      }
  
      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        price: 100,
        available: true
      }
  
      const mockFatherService = {
        _id: '123',
        name: 'Service 2',
        description: 'Description 1',
        type: 'subservice',
        available: true
      }
  
      jest.spyOn(modelService, 'create').mockResolvedValue(mockService as any);
      jest.spyOn(modelService, 'findById').mockResolvedValue(mockFatherService as any);
  
      await expect(await service.create(createDto)).toEqual(mockService);
    })
  
    it('should create a new root service price', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'root service price',
        description: 'Description 1',
        image: null,
        fatherServiceId: null,
        price: 100
      }
  
      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        price: 100,
        available: true
      }
  
      jest.spyOn(modelService, 'create').mockResolvedValue(mockService as any);
  
      await expect(await service.create(createDto)).toEqual(mockService);
    })
  
    it('should throw an error if the father service does not exist', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }
  
      jest.spyOn(modelService, 'findById').mockResolvedValue(null);
  
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw a bad request if the subservice or price dont have fatherServiceId', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: null,
        price: null
      }
  
      jest.spyOn(modelService, 'findById').mockResolvedValue({} as any);
  
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw a bad request if the root service or root service price have fatherServiceId', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'root service',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }
  
      jest.spyOn(modelService, 'findById').mockResolvedValue({} as any);
  
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw a bad request if the root service has a price', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'root service',
        description: 'Description 1',
        image: null,
        fatherServiceId: null,
        price: 100
      }

      jest.spyOn(modelService, 'findById').mockResolvedValue({} as any);
  
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw bad request if the name already exists root service or root service price', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'root service',
        description: 'Description 1',
        image: null,
        fatherServiceId: null,
        price: null
      }

      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        type: 'root service',
        price: 100,
        available: true
      }
  
      jest.spyOn(modelService, 'findOne').mockResolvedValue(mockService as any);
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw bad request if the name already exists subservice', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }

      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        type: 'subservice',
        available: true
      }

      jest.spyOn(modelService, 'findOne').mockResolvedValue(mockService as any);
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw bad request if the father service does not exist', async () => { 
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }

      jest.spyOn(modelService, 'findById').mockResolvedValue(null);
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw bad request if the father service is a price or root service price', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }

      const mockService = {
        _id: '123',
        name: 'Service 1',
        description: 'Description 1',
        type: 'root service price',
        available: true
      }

      jest.spyOn(modelService, 'findById').mockResolvedValue(mockService as any);
            
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw bad request if the type is price and dont have price', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'price',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }

      jest.spyOn(modelService, 'findById').mockResolvedValue({} as any);
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })

    it('should throw bad request if the subservice does not exist', async () => {
      const createDto: CreateServiceDto = {
        name: 'Service 1',
        type: 'subservice',
        description: 'Description 1',
        image: null,
        fatherServiceId: '123',
        price: null
      }

      jest.spyOn(modelService, 'findById').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    })
  })

  describe('findAllRootServices', () => {
    it('should return all root services', async () => {
      const mockService = [
        {
          _id: '123',
          name: 'Service 1',
          description: 'Description 1',
          type: 'root service',
          available: true
        },
        {
          _id: '1234',
          name: 'Service 2',
          description: 'Description 2',
          type: 'root service',
          available: true
        }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockService),
      };

      jest.spyOn(modelService, 'find').mockReturnValue(mockQuery as any);

      const result =service.findAllRootServices();

      expect(result).toEqual(mockService);
      //expect(mockQuery.select).toHaveBeenCalledWith('-type -subservicesId -__v -image');
      //expect(mockQuery.exec).toHaveBeenCalled();
    })
  })

});
