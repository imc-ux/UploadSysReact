import { callRemoteFunction } from "Remote/index";
import {
  MenuManagerKey,
  UserManagerKey,
  MNoticeManagerKey,
} from "Service/index";

// 获取模板列表
export function getValidateMenuTemplate<T>(params?: T) {
  return callRemoteFunction(MenuManagerKey.GetValidateMenuTemplate, params);
}

export function insertUxVersion(params?: any) {
  return callRemoteFunction(UserManagerKey.InsertUxVersion, params);
}

export function getValidateNotice(params?: any) {
  return callRemoteFunction(MNoticeManagerKey.GetValidateNotice, params);
}
