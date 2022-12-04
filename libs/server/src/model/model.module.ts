import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import mongodb from 'mongodb';
import type { EnvBaseService } from '../env';
import { EnvModule } from '../env';
import {
  HtmlPageEntity,
  HtmlPageRepository,
  SettingsEntity,
  SettingsRepository,
  SettingsService,
} from './settings';
import { UserEntity, UserRepository, UserService } from './user';
import { CsvService, VpoEntity, VpoRepository, VpoService } from './vpo';

const entities = [UserEntity, VpoEntity, SettingsEntity, HtmlPageEntity];

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
      VpoRepository,
      SettingsRepository,
      HtmlPageRepository,
    ]),
  ],
  providers: [UserService, VpoService, SettingsService, CsvService],
  exports: [UserService, VpoService, SettingsService, CsvService],
})
export class ModelModule {}
