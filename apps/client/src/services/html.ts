import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

export class Html {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/html` });
  }

  async getPage(name: string): Promise<HtmlPageModel> {
    const { data } = await this.http.get<HtmlPageModel>(`/${name}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }

  async savePage(name: string, dto: HtmlPageDto): Promise<HtmlPageModel> {
    const { data } = await this.http.put<HtmlPageModel>(`/${name}`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }
}

export type HtmlPageModel = HtmlPageDto & {
  id: string;
  name: string;
};

export type HtmlPageDto = {
  content: {
    [fieldName: string]: string;
  };
};
