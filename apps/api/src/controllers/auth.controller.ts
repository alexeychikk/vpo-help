import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto, LoginResponseDto, UserModel } from '@vpo-help/model';
import { CurrentUser, UserEntity, UserService } from '@vpo-help/server';
import { JwtAuthGuard } from '../guards';
import { AuthService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.upsertByEmail(loginDto.email);
    const accessToken = await this.authService.createAccessToken(user);
    return new LoginResponseDto({
      user: new UserModel<string>({ ...user, id: user.id.toString() }),
      accessToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(200)
  async verify(@CurrentUser() user: UserEntity) {
    return user;
  }
}
