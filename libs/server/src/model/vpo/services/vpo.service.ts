import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  addDays,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns';
import type { Day } from 'date-fns';
import { groupBy, omit } from 'lodash';
import type {
  IdType,
  PaginationSearchSortDto,
  VpoBaseModel,
  VpoModel,
  VpoRelativeModel,
} from '@vpo-help/model';
import {
  ScheduleAvailableDto,
  ScheduleSlotAvailableDto,
} from '@vpo-help/model';
import { ChainKey, PromiseChain, setTimeOnDate } from '@vpo-help/utils';
import { SettingsService } from '../../settings';
import { VpoEntity } from '../entities';
import { VpoRepository } from './vpo.repository';

@Injectable()
export class VpoService {
  constructor(
    private readonly settingsService: SettingsService,
    readonly vpoRepository: VpoRepository,
  ) {}

  async register(model: VpoModel): Promise<VpoEntity> {
    let entity = await this.findByReferenceNumber(
      model.vpoReferenceNumber,
    ).catch(() => undefined);

    await this.validateVpoRegistration(model, entity);

    await this.lockByDate(model.scheduleDate, async () => {
      await this.ensureDateAvailable(model.scheduleDate);

      const rawModel = omit(model, [
        'id',
        'createdAt',
        'updatedAt',
        'receivedHelpDate',
        'receivedGoods',
        'mainVpoReferenceNumber',
      ]);

      if (entity) {
        entity = await this.vpoRepository.saveExisting(
          Object.assign(entity, rawModel),
        );
      } else {
        entity = await this.vpoRepository.save(new VpoEntity(rawModel));
      }
    });

    return entity!;
  }

  async registerBulk(
    mainVpoModel: VpoModel,
    relativeVpoModels: VpoRelativeModel[],
  ) {
    const models = [mainVpoModel, ...relativeVpoModels];

    const entities = await Promise.all(
      models.map((model) =>
        this.findByReferenceNumber(model.vpoReferenceNumber).catch(
          () => undefined,
        ),
      ),
    );

    await Promise.all(
      models.map((model, index) =>
        this.validateVpoRegistration(model, entities[index]),
      ),
    );

    const [mainVpo, ...relativeVpos] = await this.lockByDate(
      mainVpoModel.scheduleDate,
      async () => {
        await this.ensureDateAvailable(mainVpoModel.scheduleDate);

        return Promise.all(
          models.map(async (model, index) => {
            let entity = entities[index];
            const rawModel = omit(model, [
              'id',
              'createdAt',
              'updatedAt',
              'receivedHelpDate',
              'receivedGoods',
              'mainVpoReferenceNumber',
            ]);
            rawModel.scheduleDate = mainVpoModel.scheduleDate;

            if (entity) {
              entity = await this.vpoRepository.saveExisting(
                Object.assign(entity, rawModel),
              );
            } else {
              entity = await this.vpoRepository.save(
                new VpoEntity({
                  ...rawModel,
                  email: rawModel.email || '',
                  phoneNumber: rawModel.phoneNumber || '',
                  taxIdNumber: rawModel.taxIdNumber || '',
                  mainVpoReferenceNumber: mainVpoModel.vpoReferenceNumber,
                }),
              );
            }

            return entity;
          }),
        );
      },
    );

    return { mainVpo, relativeVpos };
  }

  async upsert(model: VpoModel): Promise<VpoEntity> {
    const entity = plainToInstance(VpoEntity, instanceToPlain(model));
    if (model.id) {
      return this.vpoRepository.saveExisting(entity);
    }
    return this.vpoRepository.save(entity);
  }

  async findById(id: IdType): Promise<VpoEntity> {
    return this.vpoRepository.findById(id);
  }

  async findByReferenceNumber(vpoReferenceNumber: string): Promise<VpoEntity> {
    return this.vpoRepository.findByReferenceNumber(vpoReferenceNumber);
  }

  async paginate(dto: PaginationSearchSortDto<VpoEntity>) {
    return this.vpoRepository.paginate(dto);
  }

  async getAvailableSchedule(): Promise<ScheduleAvailableDto> {
    const { common, schedule } = await this.settingsService.getAllSettings();

    const result = new ScheduleAvailableDto({
      items: [],
    });
    const startDate = new Date();
    if (!isBefore(startDate, common.endOfRegistrationDate)) return result;

    const vpoList = await this.vpoRepository.findByScheduleDate(startDate);
    const groupedVpoList = groupBy(vpoList, (vpo) =>
      vpo.scheduleDate.toISOString(),
    );

    let daysAvailable = 0;
    let scheduleDaysAvailable = common.scheduleDaysAvailable;
    let date = startDate;
    while (daysAvailable !== scheduleDaysAvailable) {
      const slots = schedule[date.getDay() as Day];
      const dateSlots: ScheduleSlotAvailableDto[] = [];

      for (const slot of slots) {
        const slotDateFrom = setTimeOnDate(slot.timeFrom, date);
        if (!isBefore(slotDateFrom, common.endOfRegistrationDate)) break;
        const slotDateTo = setTimeOnDate(slot.timeTo, date);
        if (!isAfter(slotDateTo, common.startOfRegistrationDate)) continue;
        if (!isAfter(slotDateTo, date)) continue;

        const takenSlotsCount =
          groupedVpoList[slotDateFrom.toISOString()]?.length || 0;
        if (slot.numberOfPersons - takenSlotsCount < 1) continue;

        dateSlots.push(
          new ScheduleSlotAvailableDto({
            dateFrom: slotDateFrom,
            dateTo: slotDateTo,
          }),
        );
        if (!isBefore(slotDateTo, common.endOfRegistrationDate)) break;
      }

      if (dateSlots.length) {
        daysAvailable++;
        result.items.push(...dateSlots);
        // If today not all time slots are available, add another day to schedule
        if (
          date.getTime() === startDate.getTime() &&
          dateSlots.length < slots.length
        ) {
          scheduleDaysAvailable++;
        }
      }

      date = addDays(startOfDay(date), 1);
      if (!isBefore(date, common.endOfRegistrationDate)) break;
    }

    return result;
  }

  private async validateVpoRegistration(
    model: VpoBaseModel,
    entity?: VpoEntity,
  ) {
    if (!entity) return;
    const settings = await this.settingsService.getCommonSettings();
    if (entity.receivedHelpDate) {
      const daysSinceLastHelp = differenceInDays(
        model.scheduleDate,
        entity.receivedHelpDate,
      );
      if (daysSinceLastHelp < settings.daysToNextVpoRegistration) {
        throw new ConflictException(
          `Help can be received once in ${settings.daysToNextVpoRegistration} days`,
        );
      }
    }
    if (model.scheduleDate.getTime() === entity.scheduleDate.getTime()) {
      throw new ConflictException(`Registration has been already scheduled`);
    }
    if (!isBefore(entity.scheduleDate, settings.startOfRegistrationDate)) {
      throw new ConflictException(
        `You have already registered in current registration period`,
      );
    }
  }

  private async ensureDateAvailable(date: Date) {
    const schedule = await this.settingsService.getSchedule();

    const timeSlots = schedule[date.getDay() as Day];
    const time = format(date, 'HH:mm');
    const timeSlot = timeSlots.find((slot) => slot.timeFrom === time);
    if (!timeSlot) {
      throw new BadRequestException(
        `Slot with such time was not found in schedule`,
      );
    }

    const { items } = await this.getAvailableSchedule();
    const slotAvailable = items.some(
      (slot) => slot.dateFrom.getTime() === date.getTime(),
    );
    if (!slotAvailable) {
      throw new ConflictException(`Selected time slot is no longer available`);
    }
  }

  @PromiseChain()
  private async lockByDate<T>(
    @ChainKey<Date>((d) => d.toISOString()) date: Date,
    transaction: () => Promise<T>,
  ): Promise<T> {
    const result = await transaction();
    return result;
  }
}
