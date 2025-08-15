import { UsersInfo } from "Common/vo";

export function getSessionItem(key: string): string {
  return window.sessionStorage.getItem(key);
}

export function setSessionItem(key: string, value?: string) {
  if (value) {
    window.sessionStorage.setItem(key, value);
  } else {
    window.sessionStorage.removeItem(key);
  }
}

export function getLocalItem(key: string): string {
  return window.localStorage.getItem(key);
}

export function setLocalItem(key: string, value?: string) {
  if (value) {
    window.localStorage.setItem(key, value);
  } else {
    window.localStorage.removeItem(key);
  }
}

export function setSessionUserInfo(data?: UsersInfo) {
  setSessionItem(StorageType.UserId, data?.id ?? null);
  setSessionItem(StorageType.UserName, data?.name ?? null);
  setSessionItem(StorageType.UserPermission, data?.permission ?? null);
  setSessionItem(StorageType.Figure, data?.figure ?? null);
}

export enum StorageType {
  UserId = "UserId",
  UserName = "UserName",
  UserPermission = "UserPermission",
  Figure = "Figure",
}
