import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, Length } from 'class-validator';
import { IsNestedArray } from '@vpo-help/utils';

export const DEFAULT_CSV_COLUMNS: VpoExportColumnDto[] = [
  { key: 'vpoReferenceNumber', header: 'Номер довідки ВПО' },
  { key: 'vpoIssueDate', header: 'Дата видачі довідки' },
  { key: 'fullName', header: 'ПІБ' },
  { key: 'dateOfBirth', header: 'Дата народження' },
  { key: 'phoneNumber', header: 'Номер телефону' },
  { key: 'addressOfRegistration', header: 'Місто реєстрації' },
  { key: 'addressOfResidence', header: 'Місто проживання' },
  { key: 'numberOfRelatives', header: 'Членів родини' },
  { key: 'numberOfRelativesBelow16', header: 'Членів родини до 16' },
  { key: 'numberOfRelativesAbove65', header: 'Членів родини за 65' },
  { key: 'scheduleDate', header: 'Дата бронювання' },
  { key: 'receivedHelpDate', header: 'Дата обслуговування' },
];

export class VpoExportQueryDto {
  @IsNestedArray(() => VpoExportColumnDto)
  @IsOptional()
  @Transform(({ value }) => transformValueToColumns(value), {
    toClassOnly: true,
  })
  columns?: VpoExportColumnDto[] = DEFAULT_CSV_COLUMNS.map(
    (col) => new VpoExportColumnDto(col),
  );

  @IsBoolean()
  @IsOptional()
  header?: boolean = true;

  constructor(data: VpoExportQueryDto) {
    Object.assign(this, data);
  }
}

export class VpoExportColumnDto {
  @IsIn(DEFAULT_CSV_COLUMNS.map((col) => col.key))
  key!: string;

  @Length(1, 100)
  @IsOptional()
  header?: string;

  constructor(data: VpoExportColumnDto) {
    Object.assign(this, data);
  }
}

function transformValueToColumns(
  value: unknown,
): VpoExportColumnDto[] | unknown {
  if (typeof value !== 'string') return value;
  const columns = value.split(',');
  return columns.map((col) => {
    const [key, header] = col.split(':');
    const dto = new VpoExportColumnDto({ key });
    if (header) dto.header = header;
    else if (header == undefined)
      dto.header = DEFAULT_CSV_COLUMNS.find((c) => c.key === key)?.header;
    return dto;
  });
}
