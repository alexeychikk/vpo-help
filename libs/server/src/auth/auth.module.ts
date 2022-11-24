import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthGuard } from './guards';
import { AuthAdapter } from './services';

@Module({
  imports: [HttpModule],
  providers: [AuthAdapter, AuthGuard],
  exports: [AuthAdapter, AuthGuard],
})
export class AuthModule {}
