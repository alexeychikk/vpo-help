import { SetMetadata } from '@nestjs/common';
import type { PermissionMap } from '@vpo-help/model';

export const UsePermissions = (options: PermissionMap) => {
  return SetMetadata('permissions', options);
};
