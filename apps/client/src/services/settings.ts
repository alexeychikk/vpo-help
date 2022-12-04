import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { SettingsDto, UpdateSettingsDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { ACCESS_TOKEN } from '../constants';

export class Settings {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/settings` });
  }

  async getSettings(): Promise<Serialized<SettingsDto>> {
    const { data } = await this.http.get<Serialized<SettingsDto>>('', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }

  async saveSettings(
    dto: Serialized<UpdateSettingsDto>,
  ): Promise<Serialized<SettingsDto>> {
    const { data } = await this.http.put<Serialized<SettingsDto>>('', dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }
}
