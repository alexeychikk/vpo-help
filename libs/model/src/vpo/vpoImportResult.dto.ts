import { IsArray, IsInt, IsString, Min } from 'class-validator';

export class VpoImportResultDto {
  @IsInt()
  @Min(0)
  total!: number;

  @IsInt()
  @Min(0)
  processed!: number;

  @IsString({ each: true })
  @IsArray()
  failed!: string[];

  constructor(data: VpoImportResultDto) {
    Object.assign(this, data);
  }
}
