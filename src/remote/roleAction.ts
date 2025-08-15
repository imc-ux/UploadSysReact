import { callService } from '@/util/requestUtil';
import { RoleManager } from '@/util/constants';
import { UserRoleInfo, RoleInfo } from '@/vo/Role';

export function getUserRoleList() {
  return callService(RoleManager.GetUserRoleList);
}
export function getRoleList(param: RoleInfo) {
  return callService(RoleManager.GetRoleList, param);
}

export function createRoleToUser(param: UserRoleInfo) {
  return callService(RoleManager.CreateRoleToUser, param);
}

export function createRoleInfo(param: RoleInfo) {
  return callService(RoleManager.CreateRoleInfo, param);
}

export function deleteRoleFromUser(param: RoleInfo) {
  return callService(RoleManager.DeleteRoleFromUser, param);
}

export function updateRoleInfo(param: RoleInfo) {
  return callService(RoleManager.UpdateRoleInfo, param);
}

export function getUserActivePermission(param: string) {
  return callService(RoleManager.GetUserActivePermission, param, 'get', false);
}
