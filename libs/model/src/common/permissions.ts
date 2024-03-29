export enum Role {
  Vpo = 'vpo',
  Admin = 'admin',
}

export enum Permission {
  Schedule = 'schedule',
  Vpo = 'vpo',
  VpoList = 'vpoList',
  VpoExport = 'vpoExport',
  VpoImport = 'vpoImport',
  Settings = 'settings',
  Html = 'html',
}

export enum AccessType {
  Read = 'read',
  Write = 'write',
}

export type PermissionMap = Partial<Record<Permission, AccessType[]>>;

export const PERMISSIONS: {
  [key in Role]: PermissionMap;
} = {
  [Role.Admin]: {
    [Permission.Schedule]: [AccessType.Read, AccessType.Write],
    [Permission.Vpo]: [AccessType.Read, AccessType.Write],
    [Permission.VpoList]: [AccessType.Read, AccessType.Write],
    [Permission.VpoExport]: [AccessType.Read, AccessType.Write],
    [Permission.VpoImport]: [AccessType.Read, AccessType.Write],
    [Permission.Settings]: [AccessType.Read, AccessType.Write],
    [Permission.Html]: [AccessType.Read, AccessType.Write],
  },
  [Role.Vpo]: {
    [Permission.Schedule]: [AccessType.Read],
    [Permission.Settings]: [AccessType.Read],
    [Permission.Html]: [AccessType.Read],
  },
};
