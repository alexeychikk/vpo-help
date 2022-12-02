import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { HtmlPageModel, UpdateHtmlPageDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { ACCESS_TOKEN } from '../constants';

export class Html {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/html` });
  }

  async getPage(name: string): Promise<Serialized<HtmlPageModel>> {
    const { data } = await this.http.get<Serialized<HtmlPageModel>>(
      `/${name}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      },
    );
    return data;
  }

  async createPage(
    name: string,
    dto: Serialized<HtmlPageModel>,
  ): Promise<Serialized<HtmlPageModel>> {
    const { data } = await this.http.post<Serialized<HtmlPageModel>>(
      `/${name}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      },
    );
    return data;
  }

  async updatePage(
    name: string,
    dto: Serialized<UpdateHtmlPageDto>,
  ): Promise<Serialized<HtmlPageModel>> {
    const { data } = await this.http.put<Serialized<HtmlPageModel>>(
      `/${name}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      },
    );
    return data;
  }
}
