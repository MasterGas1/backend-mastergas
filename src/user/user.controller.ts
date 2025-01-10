import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  findOne(@Body() {userId}: {userId: string}) {
    return this.userService.findOneByToken(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Put('/changePasswordByTokenInEmail')
  changePasswordByTokenInEmail(@Body('userId') userId: string, @Body() {password}: UpdatePasswordUserDto) {
    return this.userService.changePasswordByTokenInEmail(userId, password);
  }

  @Get('/getUserStatusAndUpdateByToken')
  getUserStatusAndUpdateByToken(@Body('userId') userId: string) {
    return this.userService.getUserStatusAndUpdateByToken(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
