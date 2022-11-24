import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import type { LoginDto, LoginResponseDto, UserModel } from '@vpo-help/model';
import {
  EnvBaseService,
  EnvModule,
  ModelModule,
  UserRepository,
} from '@vpo-help/server';
import type { Serialized } from '@vpo-help/utils';

jest.setTimeout(10000);

const testApps: TestApp[] = [];
let dbApp: NestFastifyApplication;

@Injectable()
class TestEnvService extends EnvBaseService {}

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [EnvModule.register(TestEnvService), ModelModule],
  }).compile();

  dbApp = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  await dbApp.init();
});

afterAll(async () => {
  await Promise.all(testApps.map((app) => app.teardown()));
  await dbApp.close();
});

export class TestApp {
  private loginResponsePromise: Promise<Serialized<LoginResponseDto>>;

  constructor(options: {
    loginResponsePromise: Promise<Serialized<LoginResponseDto>>;
  }) {
    this.loginResponsePromise = options.loginResponsePromise;
  }

  private static get requestApi() {
    return supertest(process.env['API_SERVICE_URL']);
  }

  private static async createUser(
    dto?: Partial<LoginDto>,
  ): Promise<Serialized<LoginResponseDto>> {
    const { body } = await TestApp.requestApi
      .post('/auth/login')
      .send({ email: faker.internet.email(new ObjectId().toString()), ...dto })
      .expect(200);

    return body;
  }

  static asNewUser(dto?: Partial<LoginDto> & { userId?: string }): TestApp {
    let loginResponsePromise: Promise<Serialized<LoginResponseDto>>;
    if (dto?.userId) {
      loginResponsePromise = dbApp
        .get(UserRepository)
        .findById(dto.userId)
        .then(({ email }) => TestApp.createUser({ email }));
    } else {
      loginResponsePromise = TestApp.createUser(dto);
    }
    const app = new TestApp({ loginResponsePromise });
    testApps.push(app);
    return app;
  }

  asNewUser = TestApp.asNewUser;
  requestApi = TestApp.requestApi;

  get userRepository() {
    return dbApp.get(UserRepository);
  }

  async requestApiAsUser(
    fn: (request: supertest.SuperTest<supertest.Test>) => supertest.Test,
  ): Promise<supertest.Test> {
    return fn(TestApp.requestApi).auth(await this.getCurrentAccessToken(), {
      type: 'bearer',
    });
  }

  async getCurrentAccessToken(): Promise<string> {
    return (await this.loginResponsePromise).accessToken?.access_token;
  }

  async getCurrentUser(): Promise<Serialized<UserModel>> {
    return (await this.loginResponsePromise).user;
  }

  async teardown() {
    /* */
  }
}

export const testApp = TestApp.asNewUser();
