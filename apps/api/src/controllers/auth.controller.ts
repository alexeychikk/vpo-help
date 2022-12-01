import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LoginAsUserDto, LoginAsVpoDto } from '@vpo-help/model';
import { AuthService } from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async loginAsUser(@Body() dto: LoginAsUserDto) {
    return this.authService.loginAsUser(dto);
  }

  @Post('login/vpo')
  @HttpCode(200)
  async loginAsVpo(@Body() dto: LoginAsVpoDto) {
    return this.authService.loginAsVpo(dto);
  }
}
