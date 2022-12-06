import { Length, MinDate } from 'class-validator';
import { composeDecorators } from '@vpo-help/utils';

export const IsVpoIssueDate = () =>
  composeDecorators(
    MinDate(new Date(`2021-12-31T21:00:00.000Z`), {
      message: ({ property }) =>
        `minimal allowed date for ${property} is 2022-01-01`,
    }),
  );

export const IsVpoReferenceNumber = () => composeDecorators(Length(3, 50));
