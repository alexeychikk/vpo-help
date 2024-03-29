import { pipeline, Writable } from 'stream';
import { promisify } from 'util';
import type { MultipartFile } from '@fastify/multipart';
import type { HttpException } from '@nestjs/common';
import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { parse as parseCsv, stringify as stringifyCsv } from 'csv';
import {
  format as formatDate,
  parse as parseDate,
  set as setDate,
} from 'date-fns';
import { omit } from 'lodash';
import type {
  BaseModel,
  PaginationSearchSortDto,
  VpoExportQueryDto,
} from '@vpo-help/model';
import {
  CSV_COLUMN_KEYS,
  ReceivedHelpDto,
  VpoImportError,
  VpoImportResultDto,
  VpoModel,
} from '@vpo-help/model';
import { validateEntity } from '../../../utils';
import type { EntityConstructorData } from '../../common';
import { VpoEntity } from '../entities';
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
        date: (value) => {
          return formatDate(value, 'dd.MM.yyyy');
        },
      },
      columns: query.columns,
    });

    pipeline(
      cursor.stream({
        transform: (doc: VpoEntity) => {
          const { scheduleDate, ...rest } = doc;
          return {
            ...rest,
            scheduleDate: formatDate(scheduleDate, 'dd.MM.yyyy HH:mm'),
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
      disposition: `attachment; filename="vpo_export_${formatDate(
        new Date(),
        'dd.MM.yyyy',
      )}.csv"`,
    });
  }

  async updateVpoListFromFile(fileData: MultipartFile) {
    const result = new VpoImportResultDto({
      total: 0,
      processed: 0,
      failed: {},
    });
    const referenceDate = setDate(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    let rowsCounter = 0;
    let header: string[];

    const parseCsvDate = (dateStr: string, format = 'dd.MM.yyyy') =>
      parseDate(dateStr, format, referenceDate);

    await pump(
      fileData.file,
      parseCsv({ relaxColumnCount: true, trim: true }),
      new Writable({
        objectMode: true,
        highWaterMark: this.importHighWaterMark,
        write: async (columns: string[], encoding, callback) => {
          const [
            vpoReferenceNumber,
            vpoIssueDate,
            lastName,
            firstName,
            middleName,
            dateOfBirth,
            phoneNumber,
            taxIdNumber,
            email,
            addressOfRegistration,
            addressOfResidence,
            numberOfRelatives,
            numberOfRelativesBelow16,
            numberOfRelativesAbove65,
            scheduleDate,
            receivedHelpDate,
          ] = columns.slice(0, CSV_COLUMN_KEYS.length);
          const goodsColumns = columns.slice(CSV_COLUMN_KEYS.length);

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
                  name:
                    header[index + CSV_COLUMN_KEYS.length] ||
                    `unknown_${index}`,
                  amount: +value || 0,
                }),
            );

            const parsedScheduleDate = parseCsvDate(
              scheduleDate,
              'dd.MM.yyyy HH:mm',
            );

            const record: ImportedVpoRecord = {
              addressOfRegistration,
              addressOfResidence,
              dateOfBirth: parseCsvDate(dateOfBirth),
              email,
              firstName,
              lastName,
              middleName,
              numberOfRelatives: parseInt(numberOfRelatives || '0'),
              numberOfRelativesAbove65: parseInt(
                numberOfRelativesAbove65 || '0',
              ),
              numberOfRelativesBelow16: parseInt(
                numberOfRelativesBelow16 || '0',
              ),
              phoneNumber,
              taxIdNumber,
              receivedGoods,
              receivedHelpDate: receivedHelpDate
                ? parseCsvDate(receivedHelpDate)
                : parsedScheduleDate,
              scheduleDate: parsedScheduleDate,
              vpoIssueDate: parseCsvDate(vpoIssueDate),
              vpoReferenceNumber,
            };
            // TODO: bulk update
            await this.upsertVpo(record);

            result.processed++;
          } catch (error) {
            result.failed[rowsCounter + 1] = new VpoImportError({
              vpoReferenceNumber,
              error:
                (error as HttpException)['response']?.message?.toString() ||
                (error as Error).toString(),
            });
          }

          rowsCounter++;
          result.total++;
          callback();
        },
      }),
    );

    return result;
  }

  private async upsertVpo(record: ImportedVpoRecord) {
    const { matchedCount } = await this.vpoRepository.updateOne(
      { vpoReferenceNumber: record.vpoReferenceNumber },
      {
        $set: omit(record, [
          'mainVpoReferenceNumber',
          'vpoReferenceNumber',
          'scheduleDate',
        ]),
      },
    );
    if (matchedCount) return;
    const model = await validateEntity(VpoModel, record);
    await this.vpoRepository.save(new VpoEntity(model as ImportedVpoRecord));
  }
}

type ImportedVpoRecord = Omit<
  EntityConstructorData<VpoEntity>,
  keyof BaseModel
>;
