import type { AxiosInstance } from 'axios';
import axios from 'axios';
import moment from 'moment';
import type { ScheduleAvailableDto, ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { ACCESS_TOKEN } from '../constants';

export class Schedule {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/schedule` });
  }

  async getSchedule(): Promise<Serialized<ScheduleDto>> {
    const { data } = await this.http.get<Serialized<ScheduleDto>>('', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }

  async saveSchedule(
    schedule: Serialized<ScheduleDto>,
  ): Promise<Serialized<ScheduleDto>> {
    const { data } = await this.http.put<Serialized<ScheduleDto>>(
      '',
      schedule,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      },
    );
    return data;
  }

  async getAvailableSlots(): Promise<ScheduleSlotAvailableDto[]> {
    const { data } = await this.http.get<Serialized<ScheduleAvailableDto>>(
      '/available',
    );
    return data.items.map(({ dateFrom, dateTo }) => ({
      dateFrom: moment(dateFrom),
      dateTo: moment(dateTo),
    }));
  }
}

export type ScheduleSlotAvailableDto = {
  dateFrom: moment.Moment;
  dateTo: moment.Moment;
};
