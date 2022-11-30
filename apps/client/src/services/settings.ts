import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { Optional } from 'utility-types';
import { ACCESS_TOKEN } from '../constants';

export class Settings {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/settings` });
  }

  async getSettings(): Promise<SettingsDto> {
    const { data } = await this.http.get<SettingsDto>('', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }

  async saveSettings(dto: Optional<SettingsDto>): Promise<SettingsDto> {
    const { data } = await this.http.put<SettingsDto>('', dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }
}

export type SettingsDto = {
  daysToNextVpoRegistration: number;
  endOfWarDate: string;
  scheduleDaysAvailable: number;
};
