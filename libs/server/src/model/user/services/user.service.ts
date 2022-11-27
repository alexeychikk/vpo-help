import { Injectable } from '@nestjs/common';
import type { IdType } from '@vpo-help/model';
import type { UserEntity } from '../entities';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async findById(id: IdType): Promise<UserEntity> {
    return this.userRepository.findById(id);
  }
}
