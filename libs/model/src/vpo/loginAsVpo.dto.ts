import type { Optional } from 'utility-types';
import { IsVpoReferenceNumber } from './decorators';

export class LoginAsVpoDto {
  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  constructor(data: Optional<LoginAsVpoDto>) {
    Object.assign(this, data);
  }
}
