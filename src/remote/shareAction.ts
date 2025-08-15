import { callService } from '@/util/requestUtil';
import { ShareManager } from '../util/constants';
import { GridDataType } from '@/vo/Share';

export function getUserList(param: GridDataType) {
  return callService(ShareManager.GetUserList, param);
}

export function getCategoryList(param: GridDataType) {
  return callService(ShareManager.GetCategoryList, param);
}

export function getTitleList(param: GridDataType) {
  return callService(ShareManager.GetTitleList, param);
}

export function clickShareTimes(param: GridDataType) {
  return callService(ShareManager.ClickShareTimes, param);
}

export function deleteMyShare(param: GridDataType) {
  return callService(ShareManager.DeleteMyShare, param);
}

export function toTopShare(param: GridDataType) {
  return callService(ShareManager.ToTopShare, param);
}

export function addMyShare(param: GridDataType) {
  return callService(ShareManager.AddMyShare, param);
}

export function myShareDetail(param: GridDataType) {
  return callService(ShareManager.MyShareDetail, param);
}

export function modifyMyShare(param: GridDataType) {
  return callService(ShareManager.ModifyMyShare, param);
}

export function getUserActivePermission(param: string) {
  return callService(ShareManager.GetUserActivePermission, param, 'get', false);
}
