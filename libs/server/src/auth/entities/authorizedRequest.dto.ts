import type { FastifyRequest } from 'fastify';
import type { UserEntity } from '../../model/user/entities/user.entity';

export type AuthorizedRequest = FastifyRequest & {
  user: UserEntity;
};
