import { callService } from '@/util/requestUtil';
import { PermissionManager } from '@/util/constants';
import { PermissionInfo, RolePermissionInfo } from '@/vo/Permission';

export function getPermissionList(param: PermissionInfo) {
  return callService(PermissionManager.GetPermissionList, param);
}

export function getRolePermissionList() {
  return callService(PermissionManager.GetRolePermissionList);
}

export function createPermissionInfo(param: PermissionInfo) {
  return callService(PermissionManager.CreatePermissionInfo, param);
}

export function updatePermissionInfo(param: PermissionInfo) {
  return callService(PermissionManager.UpdatePermissionInfo, param);
}

export function createPermissionToRole(param: RolePermissionInfo) {
  return callService(PermissionManager.CreatePermissionToRole, param);
}

export function deletePermissionFromRole(param: RolePermissionInfo) {
  return callService(PermissionManager.DeletePermissionFromRole, param);
}

export function getUserActivePermission(params: string) {
  return callService(PermissionManager.GetUserActivePermission, params, 'get', false);
}
