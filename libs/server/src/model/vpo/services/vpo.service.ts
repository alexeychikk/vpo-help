import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
import {
  ScheduleAvailableDto,
  ScheduleSlotAvailableDto,
} from '@vpo-help/model';
import type {
  IdType,
  PaginationSearchSortDto,
  VpoModel,
} from '@vpo-help/model';
import { ChainKey, PromiseChain, setTimeOnDate } from '@vpo-help/utils';
import { SettingsService } from '../../settings';
import { VpoEntity } from '../entities';
import { VpoRepository } from './vpo.repository';

@Injectable()
export class VpoService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly vpoRepository: VpoRepository,
  ) {}

  async register(model: VpoModel): Promise<VpoEntity> {
    let entity = await this.findByReferenceNumber(
      model.vpoReferenceNumber,
    ).catch(() => undefined);

    await this.validateVpoRegistration(model, entity);

    await this.lockByDate(model.scheduleDate, async () => {
      await this.ensureDateAvailable(model.scheduleDate);

      const rawModel = omit(model, ['id', 'createdAt', 'updatedAt']);

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
    if (!isBefore(startDate, common.endOfWarDate)) return result;

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
        if (!isBefore(slotDateFrom, common.endOfWarDate)) break;
        const slotDateTo = setTimeOnDate(slot.timeTo, date);
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
        if (!isBefore(slotDateTo, common.endOfWarDate)) break;
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
      if (!isBefore(date, common.endOfWarDate)) break;
    }

    return result;
  }

  private async validateVpoRegistration(model: VpoModel, entity?: VpoEntity) {
    if (!isAfter(model.scheduleDate, new Date())) {
      throw new BadRequestException(
        `Registration must be scheduled for the future`,
      );
    }
    if (entity) {
      if (entity.receivedHelpDate) {
        const settings = await this.settingsService.getCommonSettings();
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
    }
  }

  async ensureDateAvailable(date: Date) {
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
