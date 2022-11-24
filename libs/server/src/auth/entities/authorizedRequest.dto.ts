import type { FastifyRequest } from 'fastify';
import type { UserEntity } from '../../model';

export type AuthorizedRequest = FastifyRequest & {
  user: UserEntity;
};
