export interface PermissionInfo {
  id?: number;
  code?: string;
  name?: string;
  active?: string;
  createDate?: string;
  updateDate?: string;
  description?: string;
  isDelete?: string;
}

export interface RolePermissionInfo {
  permissionId?: number;
  roleId?: number;
  createDate?: string;
  isDelete?: string;
  roleCode?: string;
  roleName?: string;
  children?: PermissionInfo[];
}
