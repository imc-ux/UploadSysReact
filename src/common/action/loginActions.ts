import { callRemoteFunction } from "Remote/index";
import { UserManagerKey, verifyUserKey } from "Service/index";

// 获取用户列表
export function getUserList<T>(params?: T) {
  return callRemoteFunction(UserManagerKey.GetUserList, params);
}

// 登录验证
export function verifyUser<T>(params?: T) {
  return callRemoteFunction(verifyUserKey.VerifyUser, params);
}
