import mongoose, { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

import { Request } from './entities/request.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { NearInstaller } from 'src/near-installer/entities/near-installer.entity';
import { Service } from 'src/service/entities/service.entity';
import { NearInstallerModule } from '../near-installer/near-installer.module';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name)
    private readonly requestModel: Model<Request>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    @InjectModel(NearInstaller.name)
    private readonly nearInstallerModel: Model<NearInstaller>,

    @InjectModel(Service.name)
    private readonly serviceModel: Model<Service>,

    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    const {
      coordinates: { latitude, longitude },
      customerId,
      addressName,
      serviceId,
    } = createRequestDto;

    const customer = await this.userModel.findById(customerId);
    if (!customer) {
      throw new BadRequestException('User-customer not found');
    }

    const service = await this.serviceModel.findById(serviceId);
    if (!service) {
      throw new BadRequestException('Service not found');
    }

    const { _id } = await this.roleModel.findOne({ name: 'Installer' });

    const nearbyCoords = await this.userModel
      .find({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000,
          },
        },
        roleId: _id,
      })
      .select('_id');

    if (nearbyCoords.length === 0) {
      throw new BadRequestException('No hay instaladores cerca');
    }

    const firstInstaller = nearbyCoords.shift()._id;

    const idsInstaller = nearbyCoords.map((installer) => installer._id);

    const newRequest = {
      serviceId,
      customerId,
      installerId: firstInstaller,
      addressName,
      coordinates: { latitude, longitude },
    };

    const existRequest = await this.requestModel.findOne({
      serviceId,
      customerId,
    });

    if (existRequest) {
      throw new BadRequestException('Ya hay una solicitud pendiente');
    }

    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const request = await (
        await new this.requestModel(newRequest).save({ session })
      ).populate([
        {
          path: 'serviceId',
          model: 'Service',
          select: 'name description _id price',
        },
        {
          path: 'customerId',
          model: 'User',
          select: 'name lastName picture score',
        },
        {
          path: 'installerId',
          model: 'User',
          select: '_id name lastName picture score',
        },
      ]);

      await new this.nearInstallerModel({
        requestId: request._id,
        installersId: idsInstaller,
      }).save({ session });

      await session.commitTransaction();
      await session.endSession();

      return request;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  async findAllByToken(id: string) {
    const role = await this.roleModel.findOne({ name: 'Installer' });
    if (!role) {
      throw new BadRequestException('Execute seed first');
    }

    const installer = await this.userModel.findOne({
      _id: id,
      roleId: role._id,
    });
    if (!installer) {
      throw new BadRequestException('Instalador no encontrado');
    }

    return await this.requestModel
      .find({ installerId: id })
      .populate([
        {
          path: 'serviceId',
          model: 'Service',
          select: 'name',
        },
        {
          path: 'customerId',
          model: 'User',
          select: 'name lastName picture score',
        },
      ])
      .select('-installerId -coordinates -addressName -createdAt');
  }

  async findOneForInstallerByToken(userId: string, requestId: string) {
    const request = await this.requestModel.findById(requestId).populate([
      {
        path: 'serviceId',
        model: 'Service',
        select: 'name price',
      },
      {
        path: 'customerId',
        model: 'User',
        select: 'name lastName picture score',
      },
      {
        path: 'installerId',
        model: 'User',
        select: 'id',
      },
    ]);

    if (request.installerId.id !== userId)
      throw new BadRequestException('Installer is not corrected');

    return request;
  }

  async acceptRequest(userId: string, requestId: string) {
    const request = await this.requestModel.findById(requestId).populate([
      {
        path: 'installerId',
        model: 'User',
        select: 'id',
      },
      {
        path: 'serviceId',
        model: 'Service',
        select: 'id price',
      },
      {
        path: 'customerId',
        model: 'User',
        select: 'id',
      },
    ]);

    if (request.installerId.id !== userId)
      throw new BadRequestException('Installer is not corrected');

    const nearInstaller = await this.nearInstallerModel.findOne({
      requestId: request._id,
    });

    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      await request.deleteOne({ session });

      await nearInstaller.deleteOne({ session });

      await session.commitTransaction();

      return request;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
