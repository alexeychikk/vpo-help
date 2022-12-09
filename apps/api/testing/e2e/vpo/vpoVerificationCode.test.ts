import { testApp } from '../../testApp';

test('vpo registration is rejected when verification code is invalid', async () => {
  const vpo = testApp.getFakeVpoRaw();
  await testApp.requestApi
    .post('/vpo')
    .send({
      ...vpo,
      verificationCode: '000000',
    })
    .expect(401);
});

test('verification code - vpo registration workflow', async () => {
  const vpo = await testApp.getFakeVpo();

  const spySendVpoVerification = jest.spyOn(
    testApp.emailService,
    'sendVpoVerification',
  );
  const spySendMail = jest.spyOn(
    testApp.emailService.mailerService,
    'sendMail',
  );

  await testApp.requestApi
    .post('/auth/send-vpo-verification')
    .send({ email: vpo.email })
    .expect(200);

  const [{ verificationCode }] = spySendVpoVerification.mock.calls[0];

  await testApp.requestApi
    .post('/vpo')
    .send({
      ...vpo,
      verificationCode,
    })
    .expect(201);

  expect(spySendMail).toBeCalledWith({
    from: expect.stringContaining('vpo@happyold.com.ua'),
    to: vpo.email,
    subject: expect.any(String),
    html: expect.stringContaining(verificationCode),
  });
});
