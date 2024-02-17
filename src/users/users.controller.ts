import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateUserDTO } from './dto/create.user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  create(@Body() userDTO: CreateUserDTO) {
    return this.usersService.createUser(userDTO);
  }

  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
