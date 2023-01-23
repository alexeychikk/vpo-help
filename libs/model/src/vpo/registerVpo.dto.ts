import { IsOptional, Length } from 'class-validator';
import type { ModelConstructorData } from '../common';
import { VpoModel } from './vpo.model';

export class RegisterVpoDto extends VpoModel<string> {
  @Length(6, 6)
  @IsOptional()
  verificationCode!: string;

  constructor(data: ModelConstructorData<RegisterVpoDto>) {
    super(data);
  }
}
