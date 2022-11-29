import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LoginAsUserDto, LoginAsVpoDto } from '@vpo-help/model';
import { AuthService, UserService, VpoService } from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private vpoService: VpoService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async loginAsUser(@Body() dto: LoginAsUserDto) {
    const user = await this.userService.findByEmail(dto.email);
    await this.authService.validatePassword(dto.password, user.passwordHash);
    return this.authService.loginAsUser(user);
  }

  @Post('login/vpo')
  @HttpCode(200)
  async loginAsVpo(@Body() dto: LoginAsVpoDto) {
    const vpo = await this.vpoService.findByReferenceNumber(
      dto.vpoReferenceNumber,
    );
    return this.authService.loginAsVpo(vpo);
  }
}
