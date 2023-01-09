import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { differenceInSeconds } from 'date-fns';
import { nanoid } from 'nanoid';
import type { EmailHolderDto, VerificationCodeDto } from '@vpo-help/model';
import { PasswordService } from '../../../auth/services/password.service';
import { EnvBaseService, EnvModule } from '../../../env';
import { VerificationCodeEntity } from '../entities';
import { VerificationCodeRepository } from './verificationCode.repository';

@Injectable()
export class VerificationService {
  constructor(
    @Inject(EnvModule.ENV_SERVICE_PROVIDER_NAME)
    private readonly envService: EnvBaseService,
    private readonly passwordService: PasswordService,
    private readonly verificationCodeRepository: VerificationCodeRepository,
  ) {}

  async createVerificationCodeByEmail(
    dto: EmailHolderDto,
  ): Promise<{ entity: VerificationCodeEntity; verificationCode: string }> {
    let entity = await this.verificationCodeRepository.findOne({
      email: dto.email,
    });

    if (entity) {
      if (
        differenceInSeconds(new Date(), entity.updatedAt) <
        this.envService.EMAIL_VERIFICATION_DELAY
      ) {
        throw new ConflictException(
          `Verification code can be sent once in ${this.envService.EMAIL_VERIFICATION_DELAY} seconds`,
        );
      }
    }

    const verificationCode = nanoid(6);
    const codeHash = await this.passwordService.hashPassword(verificationCode);

    if (entity) {
      entity.codeHash = codeHash;
      entity = await this.verificationCodeRepository.saveExisting(entity);
    } else {
      entity = new VerificationCodeEntity({ email: dto.email, codeHash });
      entity = await this.verificationCodeRepository.save(entity);
    }

    return { entity, verificationCode };
  }

  async verifyCodeByEmail(dto: VerificationCodeDto) {
    const entity = await this.findByEmail(dto.email).catch(() =>
      Promise.reject(new UnauthorizedException()),
    );
    await this.passwordService.validatePassword(
      dto.verificationCode,
      entity.codeHash,
    );
    await this.verificationCodeRepository.remove(entity);
  }

  async findByEmail(email: string): Promise<VerificationCodeEntity> {
    const entity = await this.verificationCodeRepository.findOne({
      email,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }
}
