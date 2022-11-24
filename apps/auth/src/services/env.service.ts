import { Injectable } from '@nestjs/common';
import { EnvBaseService } from '@vpo-help/server';

@Injectable()
export class EnvService extends EnvBaseService {
  get JWT_SECRET(): string {
    return this.getVar('JWT_SECRET');
  }
}
