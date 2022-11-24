import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt } from 'passport-jwt';
import { UserEntity } from '../../model';
import { AuthAdapter } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  private extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(private readonly authAdapter: AuthAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      const user = plainToInstance(
        UserEntity,
        await this.authAdapter.verifyToken(token),
      );
      request.user = user;
      return true;
    } catch (err) {
      if (err instanceof HttpException && err.getStatus() < 500) {
        throw new UnauthorizedException();
      }
      throw err;
    }
  }
}
