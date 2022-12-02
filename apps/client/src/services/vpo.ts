import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
  PaginatedListDto,
  PaginationSearchSortDto,
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
    params: Serialized<PaginationSearchSortDto>,
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
}
