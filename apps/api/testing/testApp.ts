import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import type {
  LoginAsUserDto,
  LoginAsUserResponseDto,
  LoginAsVpoDto,
  LoginAsVpoResponseDto,
  UserModel,
  VpoUserModel,
} from '@vpo-help/model';
import { Role, VpoModel } from '@vpo-help/model';
import {
  AuthService,
  ClassValidationPipe,
  EnvBaseService,
  UserEntity,
  UserService,
  VpoService,
} from '@vpo-help/server';
import type { Serialized } from '@vpo-help/utils';
import { AppModule } from '../src/app.module';
import { EnvService } from '../src/services';

export const TEST_PASSWORD = '11111';

jest.setTimeout(10000);

let nestApp: NestFastifyApplication;

beforeEach(async () => {
  const dbUrl = `mongodb://localhost:27017/vpo-test-${new ObjectId()}`;
  @Injectable()
  class TestEnvService extends EnvBaseService {
    get DB_URL() {
      return dbUrl;
    }
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EnvService)
    .useClass(TestEnvService)
    .compile();

  nestApp = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );
  nestApp.useGlobalPipes(new ClassValidationPipe());

  await nestApp.init();
  await nestApp.getHttpAdapter().getInstance().ready();
});

afterEach(async () => {
  const connection = nestApp.get(getConnectionToken('default'));
  await connection.dropDatabase();
  await nestApp.close();
});

class TestApp {
  private loginResponsePromise?: Promise<
    Serialized<LoginAsUserResponseDto> | Serialized<LoginAsVpoResponseDto>
  >;

  private get app() {
    return nestApp;
  }

  get requestApi() {
    return supertest(this.app.getHttpServer());
  }

  async loginAsUser(
    dto: LoginAsUserDto,
  ): Promise<Serialized<LoginAsUserResponseDto>> {
    const { body } = await this.requestApi
      .post('/auth/login')
      .send(dto)
      .expect(200);

    return body;
  }

  async loginAsVpo(
    dto: LoginAsVpoDto,
  ): Promise<Serialized<LoginAsVpoResponseDto>> {
    const { body } = await this.requestApi
      .post('/auth/login/vpo')
      .send(dto)
      .expect(200);

    return body;
  }

  asUser(dto?: Partial<LoginAsUserDto> & { userId?: string }): TestApp {
    const userService = this.app.get(UserService);
    const authService = this.app.get(AuthService);
    const password = dto?.password || TEST_PASSWORD;

    if (dto?.userId) {
      this.loginResponsePromise = (async () => {
        const { email } = await userService.findById(dto!.userId!);
        return this.loginAsUser({
          email,
          password,
        });
      })();
    } else {
      const email =
        dto?.email || faker.internet.email(new ObjectId().toString());

      this.loginResponsePromise = (async () => {
        let user = await userService.findByEmail(email).catch(() => undefined);

        if (!user) {
          const entity = new UserEntity({
            email,
            passwordHash: await authService.hashPassword(password),
            role: Role.Admin,
          });
          user = await userService.create(entity);
        }

        return this.loginAsUser({
          email,
          password,
        });
      })();
    }

    return this;
  }

  asVpo(dto?: Partial<VpoModel>): TestApp {
    const vpoService = this.app.get(VpoService);

    if (dto?.id) {
      this.loginResponsePromise = (async () => {
        const vpo = await vpoService.findById(dto!.id!);
        return this.loginAsVpo({
          vpoReferenceNumber: vpo.vpoReferenceNumber,
        });
      })();
    } else {
      this.loginResponsePromise = (async () => {
        let vpo = dto?.vpoReferenceNumber
          ? await vpoService
              .findByReferenceNumber(dto.vpoReferenceNumber)
              .catch(() => undefined)
          : undefined;

        if (!vpo) {
          const schedule = await vpoService.getAvailableSchedule();
          const model = new VpoModel({
            addressOfRegistration: faker.address.city(),
            addressOfResidence: faker.address.streetAddress(true),
            dateOfBirth: faker.date.past(30),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            middleName: faker.name.middleName(),
            numberOfRelatives: faker.datatype.number({ min: 0, max: 10 }),
            numberOfRelativesAbove65: faker.datatype.number({
              min: 0,
              max: 10,
            }),
            numberOfRelativesBelow16: faker.datatype.number({
              min: 0,
              max: 10,
            }),
            scheduleDate: schedule.items[0].dateFrom,
            vpoIssueDate: faker.date.between(
              new Date('2022-01-01'),
              new Date(),
            ),
            vpoReferenceNumber: faker.datatype.string(5),
          });
          vpo = await vpoService.register(model);
        }

        return this.loginAsVpo({
          vpoReferenceNumber: vpo.vpoReferenceNumber,
        });
      })();
    }

    return this;
  }

  async requestApiWithAuth(
    fn: (request: supertest.SuperTest<supertest.Test>) => supertest.Test,
  ): Promise<supertest.Test> {
    return fn(this.requestApi).auth(await this.getCurrentAccessToken(), {
      type: 'bearer',
    });
  }

  async getCurrentAccessToken(): Promise<string> {
    if (!this.loginResponsePromise) {
      throw new Error('User is not authenticated');
    }
    return (await this.loginResponsePromise).accessToken?.access_token;
  }

  async getCurrentUser(): Promise<Serialized<UserModel>> {
    return this.getAuthenticatedUser();
  }

  async getCurrentVpo(): Promise<Serialized<VpoUserModel>> {
    return this.getAuthenticatedUser();
  }

  private async getAuthenticatedUser<
    T extends Serialized<UserModel> | Serialized<VpoUserModel>,
  >(): Promise<T> {
    if (!this.loginResponsePromise) {
      throw new Error('User is not authenticated');
    }
    return (await this.loginResponsePromise).user as T;
  }
}

export const testApp = new TestApp();
