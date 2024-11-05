import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<Order | BadRequestException> {
    const { installerId, customerId } = createOrderDto;

    const installerRole = await this.roleModel.findOne({ name: 'Installer' });

    const existInstaller = await this.userModel.findOne({
      _id: installerId,
      roleId: installerRole._id,
    });

    if (!existInstaller) {
      throw new BadRequestException('El instalador no existe');
    }

    const customerRole = await this.roleModel.findOne({ name: 'Customer' });

    const existCustomer = await this.userModel.findOne({
      _id: customerId,
      roleId: customerRole._id,
    });

    if (!existCustomer) {
      throw new BadRequestException('El cliente no existe');
    }

    const newOrder = {
      ...createOrderDto,
      state: 'on the way',
    };

    return (await this.orderModel.create(newOrder)).populate([
      {
        path: 'installerId',
        model: 'User',
        select: 'name lastName picture score',
        populate: {
          path: 'installerId',
          model: 'Installer',
          select: 'phoneNumber',
        },
      },
      {
        path: 'customerId',
        model: 'User',
        select: 'name lastName picture score',
      },
      {
        path: 'serviceId',
        model: 'Service',
        select: 'name price',
      },
    ]);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderModel.find().populate([
      {
        path: 'installerId',
        model: 'User',
      },
      {
        path: 'customerUserId',
        model: 'User',
      },
    ]);
    return orders;
  }

  async findOne(id: string): Promise<Order | BadRequestException> {
    const order = await this.orderModel.findById(id).populate([
      {
        path: 'installerId',
        model: 'User',
      },
      {
        path: 'customerUserId',
        model: 'User',
      },
    ]);

    if (!order) {
      throw new BadRequestException('La orden no existes');
    }
    return order;
  }

  async findFirstByTokenInstaller(installerId: string) {
    const role = await this.roleModel.findOne({ name: 'Installer' });
    if (!role) {
      throw new BadRequestException('Execute seed first');
    }
    const installer = await this.userModel.findOne({
      _id: installerId,
      roleId: role._id,
    });
    if (!installer) {
      throw new BadRequestException('El instalador no existe');
    }
    return await this.orderModel
      .findOne({
        installerId: installer._id,
        $or: [{ state: 'pending' }, { state: 'on the way' }],
      })
      .populate([
        {
          path: 'installerId',
          model: 'User',
          select: 'name lastName picture score',
          populate: {
            path: 'installerId',
            model: 'Installer',
            select: 'phoneNumber',
          },
        },
        {
          path: 'customerId',
          model: 'User',
          select: 'name lastName picture score',
        },
        {
          path: 'serviceId',
          model: 'Service',
          select: 'name price',
        },
      ]);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
