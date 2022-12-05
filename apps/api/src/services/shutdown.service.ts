import type { OnApplicationShutdown } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger('ShutdownService');

  constructor(
    @Inject(getConnectionToken('default'))
    private readonly connection: Connection,
  ) {
    this.logger.log('Init graceful shutdown');
  }

  async onApplicationShutdown() {
    this.logger.log('Graceful shutdown');
    await this.connection.close();
  }
}
