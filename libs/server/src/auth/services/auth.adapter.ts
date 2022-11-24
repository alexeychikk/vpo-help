import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import type { UserModel } from '@vpo-help/model';
import { EnvBaseService, EnvModule } from '../../env';

@Injectable()
export class AuthAdapter {
  constructor(
    @Inject(EnvModule.ENV_SERVICE_PROVIDER_NAME)
    private readonly envService: EnvBaseService,
    private readonly httpService: HttpService,
  ) {}

  async verifyToken(token: string): Promise<UserModel> {
    const res = await firstValueFrom(
      this.httpService
        .post<UserModel>(
          `${this.envService.API_SERVICE_URL}/auth/verify`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .pipe(
          catchError((err) => {
            throw err.response
              ? new HttpException(err.response.data, err.response.status)
              : new InternalServerErrorException(err);
          }),
        ),
    );

    return res.data;
  }
}
