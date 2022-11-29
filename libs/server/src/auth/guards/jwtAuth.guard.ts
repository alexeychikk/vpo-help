import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { AccessType, Permission, PermissionMap } from '@vpo-help/model';
import { PERMISSIONS } from '@vpo-help/model';
import type { UserEntity } from '../../model';
import { VpoEntity } from '../../model';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const permissions = this.reflector.get<PermissionMap | undefined>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) return true;

    const user = context.switchToHttp().getRequest().user as
      | UserEntity
      | VpoEntity;
    this.ensureUserHasPermissions(user, permissions);

    return true;
  }

  private ensureUserHasPermissions(
    user: UserEntity | VpoEntity,
    permissions: PermissionMap,
  ) {
    const role =
      user instanceof VpoEntity ? user.toVpoUserModel().role : user.role;
    const rolePermissions = PERMISSIONS[role];

    for (const [name, accessType] of Object.entries(permissions) as [
      Permission,
      AccessType[],
    ][]) {
      const allAccessTypesPresent = accessType.every((at) =>
        rolePermissions[name]?.includes(at),
      );
      if (!allAccessTypesPresent) {
        throw new ForbiddenException();
      }
    }
  }
}
