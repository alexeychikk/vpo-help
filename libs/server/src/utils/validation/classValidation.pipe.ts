import type { ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

export class ClassValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      ...options,
    });
  }
}
