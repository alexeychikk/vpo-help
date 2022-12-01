import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@vpo-help/model';
import { EnvBaseService, EnvModule } from '../../env';
import type { UserEntity } from '../../model/user/entities/user.entity';
import { UserService } from '../../model/user/services/user.service';
import type { VpoEntity } from '../../model/vpo/entities/vpo.entity';
import { VpoService } from '../../model/vpo/services/vpo.service';
import type { JwtPayload } from '../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(EnvModule.ENV_SERVICE_PROVIDER_NAME)
    envService: EnvBaseService,
    private readonly userService: UserService,
    private readonly vpoService: VpoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity | VpoEntity> {
    if (payload.role === Role.Vpo) {
      return this.vpoService.findById(payload.sub);
    }
    return this.userService.findById(payload.sub);
  }
}
