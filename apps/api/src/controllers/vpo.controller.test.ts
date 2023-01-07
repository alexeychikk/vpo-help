import { addMinutes, endOfWeek, subDays } from 'date-fns';
import { ScheduleDto } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testing';

describe('POST /vpo', () => {
  test('rejects invalid body', async () => {
    const { body } = await testApp.requestApi.post('/vpo').send({}).expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "verificationCode must be longer than or equal to 6 characters",
          "minimal allowed date for vpoIssueDate is 2022-01-01",
          "vpoReferenceNumber must match /^(\\\\d{4}-)?\\\\d{10}$/i regular expression",
          "firstName must be longer than or equal to 1 characters",
          "lastName must be longer than or equal to 1 characters",
          "middleName must be longer than or equal to 1 characters",
          "dateOfBirth must be a Date instance",
          "addressOfRegistration must be longer than or equal to 1 characters",
          "addressOfResidence must be longer than or equal to 1 characters",
          "scheduleDate must be a Date instance",
          "email must be an email",
          "phoneNumber must be a valid phone number",
          "taxIdNumber must match /^\\\\d{7,20}$/i regular expression",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('rejects vpo that already received help recently (see settings)', async () => {
    const vpo = await testApp.insertVpo({
      receivedHelpDate: subDays(new Date(), 5),
    });
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({
        ...vpo,
        verificationCode,
        scheduleDate: await testApp.getAvailableDateSlot(),
      })
      .expect(409);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Conflict",
        "message": "Help can be received once in 60 days",
        "statusCode": 409,
      }
    `);
  });

  test('registers vpo that can receive help again', async () => {
    const vpo = await testApp.insertVpo({
      receivedHelpDate: subDays(new Date(), 100),
    });
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);
    const scheduleDate = await testApp.getAvailableDateSlot(1);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode, scheduleDate })
      .expect(201);

    expect(body).toMatchObject(
      serialize({
        ...vpo.toVpoUserModel(),
        scheduleDate,
      }),
    );
  });

  test('rejects vpo that registers again on the same date', async () => {
    const vpo = await testApp.registerVpo();
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode })
      .expect(409);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Conflict",
        "message": "Registration has been already scheduled",
        "statusCode": 409,
      }
    `);
  });

  test('registers vpo that changes schedule date', async () => {
    const vpo = await testApp.asVpo().getCurrentVpo();
    const scheduleDate = await testApp.getAvailableDateSlot(1);
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode, scheduleDate })
      .expect(201);

    expect(body).toMatchObject({
      ...(await testApp.getCurrentVpoUser()),
      scheduleDate: scheduleDate.toISOString(),
    });
  });

  test('rejects if there is no time slots for a given day of the week', async () => {
    const vpo = await testApp.getFakeVpo({
      scheduleDate: endOfWeek(new Date()),
    });
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode })
      .expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": "Slot with such time was not found in schedule",
        "statusCode": 400,
      }
    `);
  });

  test('rejects if there is no such time slot', async () => {
    const vpo = await testApp.getFakeVpo({
      scheduleDate: addMinutes(await testApp.getAvailableDateSlot(), 1),
    });
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode })
      .expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": "Slot with such time was not found in schedule",
        "statusCode": 400,
      }
    `);
  });

  test('rejects if selected time slot is no longer available', async () => {
    const vpoCount = 5;
    await testApp.settingsService.updateSchedule(
      new ScheduleDto({
        0: [{ timeFrom: '13:00', timeTo: '14:00', numberOfPersons: vpoCount }],
      }),
    );

    const vpo = await testApp.getFakeVpo();
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    for (let i = 0; i < vpoCount; i++) {
      await testApp.registerVpo();
    }

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode })
      .expect(409);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Conflict",
        "message": "Selected time slot is no longer available",
        "statusCode": 409,
      }
    `);
  });

  test('rejects if the war is over', async () => {
    const vpo = await testApp.getFakeVpo();
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    await testApp.settingsService.updateCommonSettings({
      endOfWarDate: new Date(),
    });

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode })
      .expect(409);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Conflict",
        "message": "Selected time slot is no longer available",
        "statusCode": 409,
      }
    `);
  });

  test('registers new vpo', async () => {
    const vpo = await testApp.getFakeVpo();
    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, verificationCode })
      .expect(201);

    expect(body).toMatchObject({
      ...expectExtended.model(),
      role: vpo.toVpoUserModel().role,
      scheduleDate: vpo.scheduleDate.toISOString(),
      vpoReferenceNumber: vpo.vpoReferenceNumber,
    });
  });
});

describe('GET /vpo/:id', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.get(`/vpo/foo`));
  });

  test('returns vpo by id', async () => {
    const vpo = await testApp.registerVpo();
    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.get(`/vpo/${vpo.id}`).expect(200));

    expect(body).toEqual(serialize(vpo));
  });
});

describe('GET /vpo', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.get(`/vpo`));
  });

  test('returns a list of vpo-s', async () => {
    const list = [
      await testApp.insertVpo(),
      await testApp.insertVpo(),
      await testApp.insertVpo(),
    ];

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.get(`/vpo`).expect(200));

    expect(body).toEqual({
      items: serialize(list),
      totalItems: 3,
    });
  });
});
