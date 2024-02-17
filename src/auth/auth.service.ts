import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDTO } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(userDTO: CreateUserDTO) {
    const user = await this.validateUser(userDTO);

    return this.generateToken(user);
  }

  async register(userDTO: CreateUserDTO) {
    // usually for these purposes you should use passportjs
    const candidate = await this.userService.getUserByEmail(userDTO.email);

    if (candidate) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDTO.password, 5);
    const user = await this.userService.createUser({
      ...userDTO,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { username: user.email, id: user.id, roles: user.roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDTO: CreateUserDTO) {
    const user = await this.userService.getUserByEmail(userDTO.email);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User Not Found',
      });
    }

    const passwordIsValid = await bcrypt.compare(
      userDTO.password,
      user.password,
    );

    if (!user || !passwordIsValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials OR user does not exist',
      });
    }

    return user;
  }
}
