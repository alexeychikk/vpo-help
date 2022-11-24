import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FindByIdDto } from '@vpo-help/model';
import type { UserEntity } from '@vpo-help/server';
import { AuthGuard, UserService } from '@vpo-help/server';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller({ path: 'users' })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findById(@Param() params: FindByIdDto): Promise<UserEntity> {
    return this.userService.findById(params.id);
  }
}
