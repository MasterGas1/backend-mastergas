import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './entities/address.entity';
import { Model } from 'mongoose';

@Injectable()
export class AddressService {
  
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>
  ) {}
  async create(createAddressDto: CreateAddressDto): Promise<Address | BadRequestException> {

    const { name } = createAddressDto

    const existAddress = await this.addressModel.findOne({ name: name })

    if (existAddress) {
      throw new BadRequestException('La dirección ya existe')
    }

    return await this.addressModel.create(createAddressDto)
  }

  async findAll(userId: string): Promise<Address[]> {

    return await this.addressModel.find({ userId });
  }

  async findOne(id: string): Promise<Address | BadRequestException> {
    const address = await this.addressModel.findById(id);

    if (!address) {
      throw new BadRequestException('La dirección no existe');
    }

    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const {userId, ...updateAddres} = updateAddressDto;
    const address = await this.addressModel.findById(id);

    if(!address) {
      throw new NotFoundException('La dirección no existe');
    }

    const existAddress = await this.addressModel.findOne({ name: updateAddressDto.name, userId })

    if (existAddress){
      throw new BadRequestException('La dirección ya existe')
    }

    const addressUpdated = await this.addressModel.findByIdAndUpdate(id, updateAddressDto, {new: true})

    return addressUpdated;
  }

  async remove(id: string) {

    const address = await this.addressModel.findById(id);

    if(!address) {
      throw new NotFoundException('La dirección no existe');
    }

    await address.deleteOne();

    return {};
  }
}
