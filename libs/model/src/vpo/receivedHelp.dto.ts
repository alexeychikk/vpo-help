import { IsNumber, Length } from 'class-validator';

export class ReceivedHelpDto {
  @Length(1, 200)
  name!: string;

  @IsNumber()
  amount!: number;

  constructor(data: ReceivedHelpDto) {
    Object.assign(this, data);
  }
}
