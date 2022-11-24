import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import mongodb from 'mongodb';
import type { EnvBaseService } from '../env';
import { EnvModule } from '../env';
import { UserEntity, UserRepository, UserService } from './user';

const entities = [UserEntity];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvModule.ENV_SERVICE_PROVIDER_NAME],
      useFactory: (env: EnvBaseService) => ({
        type: 'mongodb',
        url: env.DB_URL,
        entities,
        synchronize: !env.IS_PROD,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        driver: mongodb,
      }),
    }),
    TypeOrmModule.forFeature([
      ...entities,
      UserRepository,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class ModelModule {}
