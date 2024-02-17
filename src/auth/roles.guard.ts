import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User not authenticated' });
      }

      const user = this.jwtService.verify(token);
      request.user = user;

      const hasAccess = user.roles.some((role) =>
        requiredRoles.includes(role.value),
      );

      // In case of false it returns by default 403 Error.
      // This is just an example of custom error handling
      if (!hasAccess) {
        throw new HttpException('No access.', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (error) {
      throw new HttpException('No access.', HttpStatus.FORBIDDEN);
    }
  }
}
