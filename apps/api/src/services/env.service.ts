import { Injectable } from '@nestjs/common';
import { EnvBaseService } from '@vpo-help/server';

@Injectable()
export class EnvService extends EnvBaseService {
  get MEMORY_LIMIT() {
    return (this.IS_PROD ? 256 : 2048) * 1024 * 1024;
  }
}
