import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ type: String, example: 'user@example.com', required: true })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'Password1234', required: true })
  @IsString()
  password: string;
}
