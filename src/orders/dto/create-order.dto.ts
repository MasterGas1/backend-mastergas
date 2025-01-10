import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateCoordsDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  installerId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  addressName: string;

  @ValidateNested()
  @Type(() => CreateCoordsDto)
  coordinates: CreateCoordsDto;

  @IsNumber()
  price: number;
}
