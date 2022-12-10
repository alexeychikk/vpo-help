import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
  LoginAsUserDto,
  LoginAsUserResponseDto,
  LoginAsVpoResponseDto,
  UserModel,
  VpoUserModel,
} from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { ACCESS_TOKEN } from '../constants';

export class Auth {
  private http: AxiosInstance;

  constructor(baseUrl: string) {
    this.http = axios.create({ baseURL: `${baseUrl}/auth` });
  }

  getToken() {
    try {
      return localStorage.getItem(ACCESS_TOKEN);
    } catch (error) {
      alert('Local storage is not available!');
      return '';
    }
  }

  async loginVpo(
    vpoReferenceNumber: string,
  ): Promise<Serialized<VpoUserModel<string>>> {
    const { data } = await this.http.post<Serialized<LoginAsVpoResponseDto>>(
      '/login/vpo',
      {
        vpoReferenceNumber,
      },
    );

    return data.user;
  }

  async loginAdmin(
    dto: Serialized<LoginAsUserDto>,
  ): Promise<Serialized<UserModel>> {
    const { data } = await this.http.post<Serialized<LoginAsUserResponseDto>>(
      '/login',
      dto,
    );
    localStorage.setItem(ACCESS_TOKEN, data.accessToken.access_token);
    return data.user;
  }

  async sendVerificationCode(email: string): Promise<void> {
    await this.http.post('/send-vpo-verification', { email });
  }
}
