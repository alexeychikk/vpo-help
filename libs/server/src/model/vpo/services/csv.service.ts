import { Injectable, StreamableFile } from '@nestjs/common';
import { stringify } from 'csv';
import { format } from 'date-fns';
import type {
  PaginationSearchSortDto,
  VpoExportQueryDto,
} from '@vpo-help/model';
import type { VpoEntity } from '../entities';
import { VpoRepository } from './vpo.repository';

@Injectable()
export class CsvService {
  constructor(private readonly vpoRepository: VpoRepository) {}

  async exportVpoList(
    dto: PaginationSearchSortDto<VpoEntity>,
    query: VpoExportQueryDto,
  ) {
    let cursor = this.vpoRepository
      .createCursor(dto.where)
      .skip((dto.page - 1) * dto.limit)
      .limit(dto.limit);
    if (dto.sort) cursor = cursor.sort(dto.sort);

    const file = stringify({
      header: query.header,
      cast: {
        date: (value) => format(value, 'dd.MM.yyyy'),
      },
      columns: query.columns,
    });

    cursor
      .stream({
        transform: (doc: VpoEntity) => {
          const { firstName, lastName, middleName, scheduleDate, ...rest } =
            doc;
          return {
            ...rest,
            fullName: `${lastName} ${firstName} ${middleName}`,
            scheduleDate: format(scheduleDate, 'dd.MM.yyyy HH:mm'),
          };
        },
      })
      .pipe(file);

    return new StreamableFile(file, {
      type: 'text/csv',
      disposition: `attachment; filename="vpo_export_${format(
        new Date(),
        'dd.MM.yyyy',
      )}.csv"`,
    });
  }
}
