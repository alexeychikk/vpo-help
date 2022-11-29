import { addMinutes, endOfWeek, subDays } from 'date-fns';
import { ScheduleDto } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { testApp } from '../../testing';

describe('POST /vpo', () => {
  test('rejects invalid body', async () => {
    const { body } = await testApp.requestApi.post('/vpo').send({}).expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "minimal allowed date for vpoIssueDate is Sat Jan 01 2022 02:00:00 GMT+0200 (Eastern European Standard Time)",
          "vpoReferenceNumber must be longer than or equal to 3 characters",
          "firstName must be longer than or equal to 1 characters",
          "lastName must be longer than or equal to 1 characters",
          "middleName must be longer than or equal to 1 characters",
          "dateOfBirth must be a Date instance",
          "addressOfRegistration must be longer than or equal to 1 characters",
          "addressOfResidence must be longer than or equal to 1 characters",
          "numberOfRelatives must not be greater than 50",
          "numberOfRelatives must not be less than 0",
          "numberOfRelatives must be an integer number",
          "scheduleDate must be a Date instance",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('rejects vpo scheduled for the past', async () => {
    const vpo = await testApp.getFakeVpo({ scheduleDate: new Date() });

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
      .expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": "Registration must be scheduled for the future",
        "statusCode": 400,
      }
    `);
  });

  test('rejects vpo that already received help recently (see settings)', async () => {
    const vpo = await testApp
      .asVpo({ receivedHelpDate: subDays(new Date(), 5) })
      .getCurrentVpo();

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
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
    const vpo = await testApp
      .asVpo({ receivedHelpDate: subDays(new Date(), 100) })
      .getCurrentVpo();
    const scheduleDate = await testApp.getAvailableDateSlot(1);

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, scheduleDate })
      .expect(201);

    expect(body).toMatchObject({
      ...(await testApp.getCurrentVpoUser()),
      scheduleDate: scheduleDate.toISOString(),
    });
  });

  test('rejects vpo that registers again on the same date', async () => {
    const vpo = await testApp.asVpo().getCurrentVpo();
    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
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

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send({ ...vpo, scheduleDate })
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

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
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

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
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

    for (let i = 0; i < vpoCount; i++) {
      await testApp.registerVpo();
    }

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
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

    await testApp.settingsService.updateCommonSettings({
      endOfWarDate: new Date(),
    });

    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
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
    const { body } = await testApp.requestApi
      .post('/vpo')
      .send(vpo)
      .expect(201);

    expect(body).toMatchObject({
      id: expectExtended.objectId(),
      createdAt: expectExtended.dateISOString(),
      updatedAt: expectExtended.dateISOString(),
      role: vpo.toVpoUserModel().role,
      scheduleDate: vpo.scheduleDate.toISOString(),
      vpoReferenceNumber: vpo.vpoReferenceNumber,
    });
  });
});