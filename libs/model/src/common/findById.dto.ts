import { IsMongoId } from 'class-validator';

export class FindByIdDto {
  @IsMongoId()
  id!: string;

  constructor(data: FindByIdDto) {
    Object.assign(this, data);
  }
}
