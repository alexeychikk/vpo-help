import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  CreateAdminDto,
  LoginAsUserDto,
  LoginAsVpoDto,
} from '@vpo-help/model';
import {
  AccessTokenDto,
  LoginAsUserResponseDto,
  LoginAsVpoResponseDto,
  PERMISSIONS,
  Role,
  UserModel,
} from '@vpo-help/model';
import { EnvBaseService, EnvModule } from '../../env';
import { UserEntity } from '../../model/user/entities/user.entity';
import { UserService } from '../../model/user/services/user.service';
import { VpoService } from '../../model/vpo/services/vpo.service';
import type { JwtPayload } from '../entities';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(
    @Inject(EnvModule.ENV_SERVICE_PROVIDER_NAME)
    private readonly envService: EnvBaseService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly vpoService: VpoService,
  ) {}

  async onModuleInit() {
    try {
      await this.userService.findByEmail(this.envService.ADMIN_EMAIL);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.log(`Creating admin ${this.envService.ADMIN_EMAIL}`);
        await this.createAdmin({
          email: this.envService.ADMIN_EMAIL,
          password: this.envService.ADMIN_PASSWORD,
        });
      } else {
        this.logger.error(
          `Failed to create admin ${this.envService.ADMIN_EMAIL}`,
        );
        this.logger.error(error);
      }
    }
  }

  async createAdmin(dto: CreateAdminDto): Promise<UserEntity> {
    try {
      const entity = new UserEntity({
        email: dto.email,
        passwordHash: await this.passwordService.hashPassword(dto.password),
        role: Role.Admin,
      });
      const admin = await this.userService.create(entity);
      return admin;
    } catch (error) {
      return this.userService.findByEmail(dto.email);
    }
  }

  async loginAsUser(dto: LoginAsUserDto): Promise<LoginAsUserResponseDto> {
    const user = await this.userService.findByEmail(dto.email);

    await this.passwordService.validatePassword(
      dto.password,
      user.passwordHash,
    );

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

  async loginAsVpo(dto: LoginAsVpoDto): Promise<LoginAsVpoResponseDto> {
    const vpo = await this.vpoService.findByReferenceNumber(
      dto.vpoReferenceNumber,
    );

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
