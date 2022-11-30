import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
import type { VpoUserModel } from './auth';

export class Vpo {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/vpo` });
  }

  async register(vpoModel: VpoModel): Promise<VpoUserModel> {
    const { data } = await this.http.post<VpoUserModel>('', vpoModel);
    return data;
  }

  async getPaginated(
    params: PaginationParams,
  ): Promise<Paginated<VpoUserModel>> {
    const { data } = await this.http.get<Paginated<VpoUserModel>>('', {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    return data;
  }
}

export type VpoModel = {
  vpoIssueDate: string;
  vpoReferenceNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  addressOfRegistration: string;
  addressOfResidence: string;
  numberOfRelatives: number;
  numberOfRelativesBelow16: number;
  numberOfRelativesAbove65: number;
  scheduleDate: string;
  receivedHelpDate?: string;
  receivedGoods?: { [productName: string]: number };
  phoneNumber?: string;
  email?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
  sort: SortDirectionMap<VpoModel>;
};

export enum SortDirection {
  asc = 1,
  desc = -1,
}

export type SortDirectionMap<Entity = unknown> = Record<
  keyof Entity,
  SortDirection
>;

export type Paginated<T> = {
  items: T[];
  totalItems: number;
};
