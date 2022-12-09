import { IsEmail } from 'class-validator';

export class EmailHolderDto {
  @IsEmail()
  email!: string;

  constructor(data: EmailHolderDto) {
    Object.assign(this, data);
  }
}
