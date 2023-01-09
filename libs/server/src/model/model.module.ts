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
import {
  CsvService,
  VerificationCodeEntity,
  VerificationCodeRepository,
  VerificationService,
  VpoEntity,
  VpoRepository,
  VpoService,
} from './vpo';

const entities = [
  UserEntity,
  VpoEntity,
  SettingsEntity,
  HtmlPageEntity,
  VerificationCodeEntity,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvModule.ENV_SERVICE_PROVIDER_NAME],
      useFactory: (env: EnvBaseService) => ({
        type: 'mongodb',
        url: env.DB_URL,
        entities,
        synchronize: true,
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
      VerificationCodeRepository,
    ]),
  ],
  providers: [
    UserService,
    VpoService,
    SettingsService,
    CsvService,
    VerificationService,
  ],
  exports: [
    UserService,
    VpoService,
    SettingsService,
    CsvService,
    VerificationService,
  ],
})
export class ModelModule {}
