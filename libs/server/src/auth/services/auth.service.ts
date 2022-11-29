import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import {
  AccessTokenDto,
  LoginAsUserResponseDto,
  LoginAsVpoResponseDto,
  PERMISSIONS,
  Role,
  UserModel,
} from '@vpo-help/model';
import type { UserEntity, VpoEntity } from '../../model';
import type { JwtPayload } from '../entities';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<void> {
    const isEqual = await bcrypt.compare(password, passwordHash);
    if (!isEqual) {
      throw new UnauthorizedException();
    }
  }

  async loginAsUser(user: UserEntity): Promise<LoginAsUserResponseDto> {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      role: user.role,
      permissions: PERMISSIONS[user.role],
      email: user.email,
    };
    const accessToken = new AccessTokenDto({
      access_token: await this.jwtService.signAsync(payload),
    });
    return new LoginAsUserResponseDto({
      accessToken,
      permissions: payload.permissions,
      user: new UserModel({
        id: user.id.toString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        role: user.role,
      }),
    });
  }

  async loginAsVpo(vpo: VpoEntity): Promise<LoginAsVpoResponseDto> {
    const payload: JwtPayload = {
      sub: vpo.id.toString(),
      role: Role.Vpo,
      permissions: PERMISSIONS[Role.Vpo],
      vpoReferenceNumber: vpo.vpoReferenceNumber,
    };
    const accessToken = new AccessTokenDto({
      access_token: await this.jwtService.signAsync(payload),
    });
    return new LoginAsVpoResponseDto({
      accessToken,
      permissions: payload.permissions,
      user: vpo.toVpoUserModel(),
    });
  }
}
