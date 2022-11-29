import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import type {
  LoginAsUserDto,
  LoginAsUserResponseDto,
  UserModel,
} from '@vpo-help/model';
import { Role } from '@vpo-help/model';
import {
  AuthModule,
  AuthService,
  EnvBaseService,
  EnvModule,
  ModelModule,
  UserEntity,
  UserService,
} from '@vpo-help/server';
import type { Serialized } from '@vpo-help/utils';

export const TEST_PASSWORD = '11111';

jest.setTimeout(10000);

const testApps: TestApp[] = [];
let nestApp: NestFastifyApplication;

@Injectable()
class TestEnvService extends EnvBaseService {}

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [EnvModule.register(TestEnvService), ModelModule, AuthModule],
  }).compile();

  nestApp = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  await nestApp.init();
});

afterAll(async () => {
  await Promise.all(testApps.map((app) => app.teardown()));
  await nestApp.close();
});

export class TestApp {
  private loginResponsePromise: Promise<Serialized<LoginAsUserResponseDto>>;

  constructor(options: {
    loginResponsePromise: Promise<Serialized<LoginAsUserResponseDto>>;
  }) {
    this.loginResponsePromise = options.loginResponsePromise;
  }

  static get requestApi() {
    return supertest(process.env['API_SERVICE_URL']);
  }

  static async loginAsUser(
    dto: LoginAsUserDto,
  ): Promise<Serialized<LoginAsUserResponseDto>> {
    const { body } = await TestApp.requestApi
      .post('/auth/login')
      .send(dto)
      .expect(200);

    return body;
  }

  static asUser(dto?: Partial<LoginAsUserDto> & { userId?: string }): TestApp {
    let loginResponsePromise: Promise<Serialized<LoginAsUserResponseDto>>;
    const userService = nestApp.get(UserService);
    const authService = nestApp.get(AuthService);
    const password = dto?.password || TEST_PASSWORD;

    if (dto?.userId) {
      loginResponsePromise = (async () => {
        const { email } = await userService.findById(dto!.userId!);
        return TestApp.loginAsUser({
          email,
          password,
        });
      })();
    } else {
      const email =
        dto?.email || faker.internet.email(new ObjectId().toString());

      loginResponsePromise = (async () => {
        let user = await userService.findByEmail(email).catch(() => undefined);

        if (!user) {
          const entity = new UserEntity({
            email,
            passwordHash: await authService.hashPassword(password),
            role: Role.Admin,
          });
          user = await userService.create(entity);
        }

        return TestApp.loginAsUser({
          email,
          password,
        });
      })();
    }

    const app = new TestApp({ loginResponsePromise });
    testApps.push(app);
    return app;
  }

  asUser = TestApp.asUser;
  requestApi = TestApp.requestApi;

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
