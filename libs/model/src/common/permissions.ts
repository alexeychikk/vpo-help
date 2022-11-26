export enum Role {
  Vpo = 'VPO',
  Admin = 'ADMIN',
}

export enum Permission {
  Schedule = 'SCHEDULE',
  VpoList = 'VPO_LIST',
  VpoExport = 'VPO_EXPORT',
  VpoImport = 'VPO_IMPORT',
  Settings = 'SETTINGS',
  Html = 'HTML',
}

export enum AccessType {
  Read = 'READ',
  Write = 'WRITE',
}

export type PermissionMap = Partial<Record<Permission, AccessType[]>>;

export const PERMISSIONS: {
  [key in Role]: PermissionMap;
} = {
  [Role.Admin]: {
    [Permission.Schedule]: [AccessType.Read, AccessType.Write],
    [Permission.VpoList]: [AccessType.Read, AccessType.Write],
    [Permission.VpoExport]: [AccessType.Read, AccessType.Write],
    [Permission.VpoImport]: [AccessType.Read, AccessType.Write],
    [Permission.Settings]: [AccessType.Read, AccessType.Write],
    [Permission.Html]: [AccessType.Read, AccessType.Write],
  },
  [Role.Vpo]: {
    [Permission.Schedule]: [AccessType.Read],
    [Permission.Html]: [AccessType.Read],
  },
};
