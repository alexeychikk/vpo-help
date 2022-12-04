import type { AxiosInstance } from 'axios';
import axios from 'axios';
import FileDownload from 'js-file-download';
import type {
  PaginatedListDto,
  VpoImportResultDto,
  VpoModel,
  VpoUserModel,
} from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { ACCESS_TOKEN } from '../constants';

export class Vpo {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/vpo` });
  }

  async register(
    vpoModel: Serialized<VpoModel>,
  ): Promise<Serialized<VpoUserModel>> {
    const { data } = await this.http.post<Serialized<VpoUserModel>>(
      '',
      vpoModel,
    );
    return data;
  }

  async getPaginated(
    params: PaginationSearchSortParams,
  ): Promise<Serialized<PaginatedListDto<VpoModel>>> {
    const { data } = await this.http.get<
      Serialized<PaginatedListDto<VpoModel>>
    >('', {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }

  async downloadVpoList(params: PaginationSearchSortParams) {
    const { data } = await this.http.get('/export', {
      params,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    FileDownload(data, `vpo_list_${params.limit}.csv`);
  }

  async uploadFile(file: File): Promise<Serialized<VpoImportResultDto>> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await this.http.post<Serialized<VpoImportResultDto>>(
      '/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      },
    );
    return data;
  }
}

export type PaginationSearchSortParams = {
  page: number;
  limit: number;
  [x: string]: string | number;
};
