export const dateISOString = () =>
  expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);

export const objectId = () => expect.stringMatching(/^[0-9a-fA-F]{24}$/);

export const model = () => ({
  id: objectId(),
  updatedAt: dateISOString(),
  createdAt: dateISOString(),
});

export const accessToken = () => expect.stringMatching(/^.{128,}$/);

export const time = () => expect.stringMatching(/^\d{2}:\d{2}$/);

export const scheduleSlot = () =>
  expect.objectContaining({
    timeFrom: time(),
    timeTo: time(),
    numberOfPersons: expect.any(Number),
  });
