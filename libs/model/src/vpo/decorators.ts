import { Length, MinDate } from 'class-validator';
import { format } from 'date-fns';
import { composeDecorators } from '@vpo-help/utils';

export const IsVpoIssueDate = () =>
  composeDecorators(
    MinDate(new Date(`2022-01-01`), {
      message: ({ property, constraints }) =>
        `minimal allowed date for ${property} is ${format(
          constraints[0],
          'yyyy-MM-dd',
        )}`,
    }),
  );

export const IsVpoReferenceNumber = () => composeDecorators(Length(3, 50));
