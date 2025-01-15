import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Login',
    description: 'Auth will give us the access to the applications',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Creation sucessfuly',
    schema: {
      example: {
        name: 'User',
        lastName: 'User',
        token: 'token',
        role: 'admin',
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description:
      'Bad request if you dont send correct password or email, or user not found',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found if the seed is not executed',
  })
  auth(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.auth(createAuthDto);
  }
}
