import { Injectable } from '@nestjs/common';
import type { IdType } from '@vpo-help/model';
import { UserEntity } from '../entities';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async upsertByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    return user ? user : this.create(new UserEntity({ email }));
  }

  async findById(id: IdType): Promise<UserEntity> {
    return this.userRepository.findById(id);
  }
}
