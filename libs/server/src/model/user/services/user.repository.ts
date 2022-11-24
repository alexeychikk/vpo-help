import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { UserEntity } from '../entities';

@EntityRepository(UserEntity)
export class UserRepository extends BaseEntityRepository<UserEntity> {}
