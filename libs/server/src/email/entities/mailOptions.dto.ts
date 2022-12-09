import { Length } from 'class-validator';

export class MailOptionsDto {
  @Length(1)
  from!: string;

  @Length(1)
  to!: string;

  @Length(1)
  subject!: string;

  @Length(1)
  html!: string;

  constructor(data: MailOptionsDto) {
    Object.assign(this, data);
  }
}
