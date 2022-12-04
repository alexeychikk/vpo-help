import { pipeline, Writable } from 'stream';
import { promisify } from 'util';
import type { MultipartFile } from '@fastify/multipart';
import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { parse as parseCsv, stringify as stringifyCsv } from 'csv';
import { format, parse } from 'date-fns';
import type {
  PaginationSearchSortDto,
  VpoExportQueryDto,
} from '@vpo-help/model';
import { ReceivedHelpDto, VpoImportResultDto } from '@vpo-help/model';
import type { VpoEntity } from '../entities';
import { VpoRepository } from './vpo.repository';
const pump = promisify(pipeline);

@Injectable()
export class CsvService {
  private readonly logger = new Logger('CsvService');
  readonly importHighWaterMark = 100;

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

    const file = stringifyCsv({
      header: query.header,
      cast: {
        date: (value) => format(value, 'dd.MM.yyyy'),
      },
      columns: query.columns,
    });

    pipeline(
      cursor.stream({
        transform: (doc: VpoEntity) => {
          const { firstName, lastName, middleName, scheduleDate, ...rest } =
            doc;
          return {
            ...rest,
            fullName: `${lastName} ${firstName} ${middleName}`,
            scheduleDate: format(scheduleDate, 'dd.MM.yyyy HH:mm'),
          };
        },
      }) as NodeJS.ReadableStream,
      file,
      (err) => {
        if (err) this.logger.error(err);
      },
    );

    return new StreamableFile(file, {
      type: 'text/csv',
      disposition: `attachment; filename="vpo_export_${format(
        new Date(),
        'dd.MM.yyyy',
      )}.csv"`,
    });
  }

  async updateVpoListFromFile(fileData: MultipartFile) {
    const referenceDate = new Date();
    let rowsCounter = 0;
    let recordsProcessed = 0;
    const recordsFailed: string[] = [];
    let header: string[];

    await pump(
      fileData.file,
      parseCsv({ relaxColumnCount: true }),
      new Writable({
        objectMode: true,
        highWaterMark: this.importHighWaterMark,
        write: async (columns: string[], encoding, callback) => {
          const [vpoReferenceNumber, receivedHelpDate, ...goodsColumns] =
            columns;

          if (rowsCounter === 0) {
            header = [...columns];
            rowsCounter++;
            return callback();
          }

          try {
            if (!vpoReferenceNumber) throw new NotFoundException();

            const receivedGoods = goodsColumns.map(
              (value, index) =>
                new ReceivedHelpDto({
                  name: header[index + 2] || `unknown_${index + 2}`,
                  amount: +value || 0,
                }),
            );

            const record: ImportedVpoRecord = {
              vpoReferenceNumber,
              receivedHelpDate: receivedHelpDate
                ? parse(receivedHelpDate, 'dd.MM.yyyy', referenceDate)
                : referenceDate,
              receivedGoods,
            };
            // TODO: bulk update
            await this.updateVpo(record);

            recordsProcessed++;
          } catch (error) {
            recordsFailed.push(`${rowsCounter}:${vpoReferenceNumber}`);
          }

          rowsCounter++;
          callback();
        },
      }),
    );

    return new VpoImportResultDto({
      total: recordsProcessed + recordsFailed.length,
      processed: recordsProcessed,
      failed: recordsFailed,
    });
  }

  private async updateVpo(record: ImportedVpoRecord) {
    const { matchedCount } = await this.vpoRepository.updateOne(
      { vpoReferenceNumber: record.vpoReferenceNumber },
      { $set: record },
    );
    if (!matchedCount) throw new NotFoundException();
  }
}

type ImportedVpoRecord = Pick<
  VpoEntity,
  'vpoReferenceNumber' | 'receivedHelpDate' | 'receivedGoods'
>;
