import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { VerificationCodeEntity } from '../entities';

@EntityRepository(VerificationCodeEntity)
export class VerificationCodeRepository extends BaseEntityRepository<VerificationCodeEntity> {}
