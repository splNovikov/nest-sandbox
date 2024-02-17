import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { Roles } from '../auth/roles.auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AddRoleDTO } from './dto/add-role.dto';
import { BanUserDTO } from './dto/ban-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDTO: CreateUserDTO) {
    return this.usersService.createUser(userDTO);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  // @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Add roles to User' })
  @ApiResponse({ status: 200 })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDTO) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Ban User' })
  @ApiResponse({ status: 200 })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserDTO) {
    return this.usersService.ban(dto);
  }
}
