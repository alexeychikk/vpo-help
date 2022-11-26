import type { Optional } from 'utility-types';
import { IsVpoReferenceNumber } from './isVpoReferenceNumber.decorator';

export class LoginAsVpoDto {
  @IsVpoReferenceNumber()
  vpoReferenceNumber!: string;

  constructor(data: Optional<LoginAsVpoDto>) {
    Object.assign(this, data);
  }
}
