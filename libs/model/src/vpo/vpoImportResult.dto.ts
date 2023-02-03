import { Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class VpoImportResultDto {
  @IsInt()
  @Min(0)
  total!: number;

  @IsInt()
  @Min(0)
  processed!: number;

  failed!: Record<number, VpoImportError>;

  constructor(data: VpoImportResultDto) {
    Object.assign(this, data);
  }
}

export class VpoImportError {
  @Expose({ name: 'v' })
  vpoReferenceNumber!: string;

  @Expose({ name: 'e' })
  error!: string;

  constructor(data: VpoImportError) {
    Object.assign(this, data);
  }
}

export type VpoImportResultPlain = Omit<VpoImportResultDto, 'failed'> & {
  failed: Record<number, VpoImportErrorPlain>;
};

export type VpoImportErrorPlain = { v: string; e: string };
