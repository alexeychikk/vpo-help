import type { OnModuleInit } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { VerificationCodeEntity } from '../entities';

@EntityRepository(VerificationCodeEntity)
export class VerificationCodeRepository
  extends BaseEntityRepository<VerificationCodeEntity>
  implements OnModuleInit
{
  async onModuleInit() {
    await this.createCollectionIndex(
      { updatedAt: 1 },
      { name: 'idx_verification_code_ttl', expireAfterSeconds: 60 * 60 },
    );
  }
}
