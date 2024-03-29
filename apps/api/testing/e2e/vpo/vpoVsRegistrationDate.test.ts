import { subDays } from 'date-fns';
import { expectExtended } from '@vpo-help/testing';
import { testApp } from '../../testApp';

test('rejects vpo that registers in the same registration period', async () => {
  const vpo = await testApp.registerVpo();
  const scheduleDate = await testApp.getAvailableDateSlot(1);
  const { verificationCode } =
    await testApp.verificationService.createVerificationCodeByEmail(vpo);

  const { body } = await testApp.requestApi
    .post('/vpo')
    .send({ ...vpo, verificationCode, scheduleDate })
    .expect(409);

  expect(body).toMatchInlineSnapshot(`
    Object {
      "error": "Conflict",
      "message": "You have already registered in current registration period",
      "statusCode": 409,
    }
  `);
});

test('vpo can register again in the next registration period', async () => {
  const vpo = await testApp.insertVpo({
    scheduleDate: subDays(new Date(), 2),
  });
  const scheduleDate = await testApp.getAvailableDateSlot(1);
  const { verificationCode } =
    await testApp.verificationService.createVerificationCodeByEmail(vpo);

  const { body } = await testApp.requestApi
    .post('/vpo')
    .send({ ...vpo, verificationCode, scheduleDate })
    .expect(201);

  expect(body).toMatchObject({
    ...(await testApp.asVpo({ id: vpo.id }).getCurrentVpoUser()),
    updatedAt: expectExtended.dateISOString(),
    scheduleDate: scheduleDate.toISOString(),
  });
});
