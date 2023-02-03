import { omit, times } from 'lodash';
import { Role } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { testApp } from '../../testApp';

describe('POST /vpo/bulk', () => {
  test('rejects invalid body', async () => {
    const { body } = await testApp.requestApi
      .post('/vpo/bulk')
      .send({
        mainVpo: {},
        relativeVpos: [{}],
      })
      .expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "mainVpo.email must be an email",
          "mainVpo.phoneNumber must be a valid phone number",
          "mainVpo.taxIdNumber must match /^\\\\d{7,20}$/i regular expression",
          "mainVpo.minimal allowed date for vpoIssueDate is 2022-01-01",
          "mainVpo.vpoReferenceNumber must match /^\\\\d{4}-\\\\d{10}$/i regular expression",
          "mainVpo.firstName must be longer than or equal to 1 characters",
          "mainVpo.lastName must be longer than or equal to 1 characters",
          "mainVpo.middleName must be longer than or equal to 1 characters",
          "mainVpo.dateOfBirth must be a Date instance",
          "mainVpo.addressOfRegistration must be longer than or equal to 1 characters",
          "mainVpo.addressOfResidence must be longer than or equal to 1 characters",
          "mainVpo.scheduleDate must be a Date instance",
          "relativeVpos.0.minimal allowed date for vpoIssueDate is 2022-01-01",
          "relativeVpos.0.vpoReferenceNumber must match /^\\\\d{4}-\\\\d{10}$/i regular expression",
          "relativeVpos.0.firstName must be longer than or equal to 1 characters",
          "relativeVpos.0.lastName must be longer than or equal to 1 characters",
          "relativeVpos.0.middleName must be longer than or equal to 1 characters",
          "relativeVpos.0.dateOfBirth must be a Date instance",
          "relativeVpos.0.addressOfRegistration must be longer than or equal to 1 characters",
          "relativeVpos.0.addressOfResidence must be longer than or equal to 1 characters",
          "relativeVpos.0.scheduleDate must be a Date instance",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('registers a bunch of related vpo-s', async () => {
    const vpo = await testApp.getFakeVpo();
    const relativeVpos = times(3, () =>
      omit(testApp.getFakeVpoRaw(), ['email', 'phoneNumber', 'taxIdNumber']),
    );

    const { verificationCode } =
      await testApp.verificationService.createVerificationCodeByEmail(vpo);

    const { body } = await testApp.requestApi
      .post('/vpo/bulk')
      .send({
        mainVpo: vpo,
        relativeVpos,
        verificationCode,
      })
      .expect(201);

    expect(body).toMatchObject({
      mainVpo: expect.objectContaining({
        ...expectExtended.model(),
        vpoReferenceNumber: vpo.vpoReferenceNumber,
        scheduleDate: expectExtended.dateISOString(),
        role: Role.Vpo,
      }),
      relativeVpos: times(3, (index) =>
        expect.objectContaining({
          ...expectExtended.model(),
          vpoReferenceNumber: relativeVpos[index].vpoReferenceNumber,
          scheduleDate: expectExtended.dateISOString(),
          role: Role.Vpo,
        }),
      ),
    });
  });
});
