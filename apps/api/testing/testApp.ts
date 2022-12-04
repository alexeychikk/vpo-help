import { faker } from '@faker-js/faker';
import multipart from '@fastify/multipart';
import { Injectable } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { addDays } from 'date-fns';
import { times } from 'lodash';
import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import type {
  LoginAsUserDto,
  LoginAsUserResponseDto,
  LoginAsVpoDto,
  LoginAsVpoResponseDto,
  ScheduleSlotAvailableDto,
  UserModel,
  VpoUserModel,
} from '@vpo-help/model';
import { HtmlPageModel, VpoModel } from '@vpo-help/model';
import type { HtmlPageEntity, VpoEntity } from '@vpo-help/server';
import {
  AuthService,
  ClassValidationPipe,
  EnvBaseService,
  SettingsService,
  UserService,
  VpoService,
} from '@vpo-help/server';
import type { Serialized } from '@vpo-help/utils';
import { AppModule } from '../src/app.module';
import { EnvService } from '../src/services';

export const TEST_PASSWORD = '11111';

jest.setTimeout(30000);

let nestApp: NestFastifyApplication;

const dbUrls: string[] = [];

beforeEach(async () => {
  const dbUrl = `mongodb://localhost:27017/vpo-test-${faker.datatype.uuid()}`;
  dbUrls.push(dbUrl);

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
  await nestApp.register(multipart);
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

  get userService() {
    return this.app.get(UserService);
  }

  get vpoService() {
    return this.app.get(VpoService);
  }

  get authService() {
    return this.app.get(AuthService);
  }

  get settingsService() {
    return this.app.get(SettingsService);
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

  async getAvailableScheduleSlot(index = 0): Promise<ScheduleSlotAvailableDto> {
    const { items } = await this.vpoService.getAvailableSchedule();
    return items[index];
  }

  async getAvailableDateSlot(index = 0): Promise<Date> {
    return (await this.getAvailableScheduleSlot(index)).dateFrom;
  }

  async registerVpo(dto?: Partial<VpoModel>): Promise<VpoEntity> {
    const model = await this.getFakeVpo(dto);
    return this.vpoService.register(model);
  }

  /**
   * Fast alternative to `registerVpo` that allows writing to all the vpo fields
   * and does not depend on available scheduleDate.
   */
  async insertVpo(dto?: Partial<VpoModel>): Promise<VpoEntity> {
    const model = await this.getFakeVpo({
      scheduleDate: addDays(new Date(), 1),
      ...dto,
    });
    return this.vpoService.upsert(model);
  }

  async populateVpo(amount = 10000) {
    const result = [];
    const perIteration = 100;
    while (amount > 0) {
      amount -= perIteration;
      const count = amount >= 0 ? perIteration : perIteration + amount;
      const docs = times(count, () => this.getFakeVpoRaw());
      result.push(...docs);
      await this.vpoService.vpoRepository.insertMany(docs);
    }
    return result;
  }

  async createHtmlPage(dto?: Partial<HtmlPageModel>): Promise<HtmlPageEntity> {
    const model = new HtmlPageModel({
      name: faker.word.noun(1),
      content: {
        [faker.word.noun(1)]: `<div>${faker.lorem.lines(3)}</div>`,
      },
      ...dto,
    });
    return this.settingsService.createHtmlPage(model);
  }

  asUser(dto?: Partial<LoginAsUserDto> & { userId?: string }): TestApp {
    const password = dto?.password || TEST_PASSWORD;

    if (dto?.userId) {
      this.loginResponsePromise = (async () => {
        const { email } = await this.userService.findById(dto!.userId!);
        return this.loginAsUser({
          email,
          password,
        });
      })();
    } else {
      const email =
        dto?.email || faker.internet.email(new ObjectId().toString());

      this.loginResponsePromise = (async () => {
        let user = await this.userService
          .findByEmail(email)
          .catch(() => undefined);

        if (!user) {
          user = await this.authService.createAdmin({
            email,
            password,
          });
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
    if (dto?.id) {
      this.loginResponsePromise = (async () => {
        const vpo = await this.vpoService.findById(dto!.id!);
        return this.loginAsVpo({
          vpoReferenceNumber: vpo.vpoReferenceNumber,
        });
      })();
    } else {
      this.loginResponsePromise = (async () => {
        let vpo = dto?.vpoReferenceNumber
          ? await this.vpoService
              .findByReferenceNumber(dto.vpoReferenceNumber)
              .catch(() => undefined)
          : undefined;

        if (!vpo) vpo = await this.registerVpo(dto);

        return this.loginAsVpo({
          vpoReferenceNumber: vpo.vpoReferenceNumber,
        });
      })();
    }

    return this;
  }

  getFakeVpoRaw(dto?: Partial<VpoModel>) {
    return {
      addressOfRegistration: faker.address.city(),
      addressOfResidence: faker.address.streetAddress(true),
      dateOfBirth: faker.date.past(30),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      middleName: faker.name.middleName(),
      phoneNumber: faker.phone.phoneNumber(`+38067#######`),
      numberOfRelatives: faker.datatype.number({ min: 0, max: 10 }),
      numberOfRelativesAbove65: faker.datatype.number({
        min: 0,
        max: 10,
      }),
      numberOfRelativesBelow16: faker.datatype.number({
        min: 0,
        max: 10,
      }),
      vpoIssueDate: faker.date.between(new Date('2022-01-01'), new Date()),
      vpoReferenceNumber: faker.datatype.uuid(),
      scheduleDate: addDays(new Date(), 1),
      ...dto,
    };
  }

  async getFakeVpo(dto?: Partial<VpoModel>): Promise<VpoModel> {
    return plainToInstance(
      VpoModel,
      Object.assign(this.getFakeVpoRaw(dto), {
        scheduleDate:
          dto?.scheduleDate ||
          (await this.vpoService.getAvailableSchedule()).items[0].dateFrom,
      }),
    );
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

  async getCurrentVpoUser(): Promise<Serialized<VpoUserModel>> {
    return this.getAuthenticatedUser();
  }

  async getCurrentVpo(): Promise<Serialized<VpoModel>> {
    const vpoUser = await this.getCurrentVpoUser();
    const vpo = await this.vpoService.findById(vpoUser.id);
    return instanceToPlain(vpo) as Serialized<VpoModel>;
  }

  async expectRejectsUnauthorizedUser(
    fn: (request: supertest.SuperTest<supertest.Test>) => supertest.Test,
  ) {
    const { body } = await fn(this.requestApi).expect(401);
    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Unauthorized",
        "statusCode": 401,
      }
    `);
  }

  async expectRejectsInsufficientPermissions(
    fn: (request: supertest.SuperTest<supertest.Test>) => supertest.Test,
  ) {
    const { body } = await this.asVpo().requestApiWithAuth((req) =>
      fn(req).expect(403),
    );
    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Forbidden",
        "statusCode": 403,
      }
    `);
  }

  async expectAdmin(
    fn: (request: supertest.SuperTest<supertest.Test>) => supertest.Test,
  ) {
    await this.expectRejectsUnauthorizedUser(fn);
    await this.expectRejectsInsufficientPermissions(fn);
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
