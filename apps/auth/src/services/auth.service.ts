import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AccessTokenDto } from '@vpo-help/model';
import type { JwtPayload, UserEntity } from '@vpo-help/server';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createAccessToken(user: UserEntity): Promise<AccessTokenDto> {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
