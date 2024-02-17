import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './users.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDTO } from './dto/add-role.dto';
import { BanUserDTO } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}
  async createUser(dto: CreateUserDTO) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('admin');
    await user.$set('roles', [role.id]);

    // a hack to return roles in response
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.findAll({ include: { all: true } });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async addRole(dto: AddRoleDTO) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add('roles', role.id);
      return dto;
    }

    throw new HttpException('User or Role not found', HttpStatus.NOT_FOUND);
  }

  async ban(dto: BanUserDTO) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.banned = true;
    user.banReason = dto.reason;
    await user.save();

    return user;
  }
}
