import { Matches, MinDate } from 'class-validator';
import { composeDecorators } from '@vpo-help/utils';

export const IsVpoIssueDate = () =>
  composeDecorators(
    MinDate(new Date(`2021-12-31T21:00:00.000Z`), {
      message: ({ property }) =>
        `minimal allowed date for ${property} is 2022-01-01`,
    }),
  );

export const IsVpoReferenceNumber = () =>
  composeDecorators(Matches(/^\d{4}-\d{10}$/i));

export const IsTaxIdNumber = () => composeDecorators(Matches(/^\d{7,20}$/i));
