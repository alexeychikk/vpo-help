export const dateISOString = () =>
  expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);

export const objectId = () => expect.stringMatching(/^[0-9a-fA-F]{24}$/);

export const accessToken = () => expect.stringMatching(/^.{128,}$/);
