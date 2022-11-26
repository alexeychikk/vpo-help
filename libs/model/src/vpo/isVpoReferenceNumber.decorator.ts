import { Length } from 'class-validator';
import { composeDecorators } from '@vpo-help/utils';

export const IsVpoReferenceNumber = () => composeDecorators(Length(3, 50));
