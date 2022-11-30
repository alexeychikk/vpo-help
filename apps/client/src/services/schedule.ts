import type { AxiosInstance } from 'axios';
import axios from 'axios';
import moment from 'moment';

export class Schedule {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/schedule` });
  }

  async getSchedule(): Promise<ScheduleDto> {
    const { data } = await this.http.get<ScheduleDto>('');
    return data;
  }

  async putSchedule(schedule: ScheduleDto): Promise<ScheduleDto> {
    const { data } = await this.http.put<ScheduleDto>('', schedule);
    return data;
  }

  async getAvailableSlots(): Promise<ScheduleSlotAvailableDto[]> {
    const { data } = await this.http.get<{ items: ScheduleSlotAvailableDto[] }>(
      '/available',
    );
    return data.items.map(({ dateFrom, dateTo }) => ({
      dateFrom: moment(dateFrom),
      dateTo: moment(dateTo),
    }));
  }
}

export type ScheduleDto = Record<
  1 | 2 | 3 | 4 | 5 | 6 | 7,
  {
    timeFrom: string;
    timeTo: string;
    numberOfPersons: number;
  }
>;

export type ScheduleSlotAvailableDto = {
  dateFrom: moment.Moment;
  dateTo: moment.Moment;
};
