import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

export class Auth {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ url: `${baseUrl}/auth` });
  }

  async loginVpo(vpoReferenceNumber: string): Promise<VpoUserModel> {
    const { data } = await this.http.post<LoginAsVpoResponseDto>('/login/vpo', {
      vpoReferenceNumber,
    });

    return data.user;
  }

  async loginAdmin(dto: LoginAsAdminDto): Promise<VpoAdminModel> {
    const { data } = await this.http.post<LoginAsAdminResponseDto>(
      '/login',
      dto,
    );
    localStorage.setItem(ACCESS_TOKEN, data.accessToken.access_token);
    return data.user;
  }
}

export type LoginAsAdminDto = {
  email: string;
  password: string;
};

export type LoginAsAdminResponseDto = {
  user: VpoAdminModel;
  accessToken: { access_token: string };
};

export type VpoAdminModel = {
  id: string;
  role: 'ADMIN';
  email: string;
};

export type LoginAsVpoDto = {
  vpoReferenceNumber: string;
};

export type LoginAsVpoResponseDto = {
  user: VpoUserModel;
  accessToken: { access_token: string };
};

export type VpoUserModel = {
  id: string;
  role: 'VPO';
  vpoReferenceNumber: string;
  scheduleDate: string;
};
