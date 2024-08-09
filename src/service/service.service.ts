import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {

  constructor(
    @InjectModel(Service.name)
    private readonly ServiceModel: Model<Service> 
  ){}
  async create(createServiceDto: CreateServiceDto) {
    const {type, fatherServiceId, price} = createServiceDto;

    if ((type === 'subservice' || type === 'price') && !fatherServiceId) { // Validate if these types have a fatherServiceId
      throw new BadRequestException('The fatherServiceId field is required');
    } else if (type !== 'root service' && type !== 'root service price') { //Validate if the type is not root service
      return await this.rootFatherServices(createServiceDto);
    } else if (fatherServiceId) { //Validate if the type is root service and has a fatherServiceId
      throw new BadRequestException('Root service cannot have fatherServiceId');
    } else if (type === 'root service' && price) {
      throw new BadRequestException('Root service cannot have price');
    } else if (type === 'root service price' && !price) {
      throw new BadRequestException('The price field is required');
    }

    const isRootServiceExist = await this.ServiceModel.findOne({name: createServiceDto.name, type});

    if (isRootServiceExist) {
      throw new BadRequestException('The name already exists');
    }

    try {
      const service = await this.ServiceModel.create(createServiceDto);
      
      return {
        _id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        available: service.available
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong check the logs');
    }
  }

  async findAllRootServices(available: string) {
    if(available !== undefined) {
      return await this.ServiceModel.find({$or:[{type: 'root service'},{type: 'root service price'}], available}).select('-subservicesId -__v -available'); 
    } else {
      return await this.ServiceModel.find({$or: [{type: 'root service'},{type: 'root service price'}]}).select('-subservicesId -__v');
    }
  }

  async findOne(id: string) {
    const service = await this.ServiceModel.findById(id).select('-type -__v -fatherServiceId')
    .populate('subservicesId','-fatherServiceId -subservicesId -__v');

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const {name, description, price, available} = updateServiceDto;

    const service = await this.ServiceModel.findById(id);

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (price && (service.type !== 'price' && service.type !== 'root service price')) {
      throw new BadRequestException('The price field is required');
    }

    const repeatedService = await this.ServiceModel.findOne({name, type: service.type});

    if (repeatedService) {
      throw new BadRequestException('The name already exists');
    }

    const newService = {
      name,
      description,
      price,
      available
    }

    return await this.ServiceModel.findByIdAndUpdate(id, newService, {new: true}).select('-type -__v -image -fatherServiceId -subservicesId');
  }

  async remove(id: string) {
    let service = await this.ServiceModel.findById(id);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    for (let subservice of service.subservicesId) {
     await this.removeChindlrens(subservice._id);
    }

    await service.deleteOne();

    return {
      msg: 'Servicio eliminado'
    }
  }

  async rootFatherServices(createServiceDto: CreateServiceDto) {
    const {type, price, fatherServiceId, name} = createServiceDto;

    const fatherExist = await this.ServiceModel.findById(fatherServiceId);

    if (!fatherExist) {
      throw new BadRequestException('The fatherServiceId does not exist');
    }

    if (fatherExist.type === 'price' || fatherExist.type === 'root service price') {
      throw new BadRequestException('The fatherServiceId is a price');
    }

    if (type === 'price' && !price) {
      throw new BadRequestException('The price field is required');
    }

    const isSubServiceExist = await this.ServiceModel.findOne({name, type, fatherServiceId});

    if (isSubServiceExist) {
      throw new BadRequestException('The name already exists');
    }

    try {
      const service = await this.ServiceModel.create(createServiceDto);

      await this.ServiceModel.findOneAndUpdate(
        { _id: fatherServiceId }, 
        { $push: { subservicesId: service._id } }
      );

      return {
        _id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        available: service.available
      };

    }catch(error) {
      console.log(error)
      throw new InternalServerErrorException('Something went wrong check the logs');
    }
  }

  async removeChindlrens(id: string  | unknown) {
    const service = await this.ServiceModel.findById(id);

    if (!service) {
      return
    }

    for (let subservice of service.subservicesId) {
      this.removeChindlrens(subservice._id);
    }

    await service.deleteOne();
  }
}
