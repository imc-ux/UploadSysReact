import { getSessionItem, StorageType } from "Helper/storageHelper";

// const SERVER_URL = "http://109.14.20.45:6636/ux/";
const SERVER_URL = "http://109.14.6.43:6636/ux/";
const LOCAL_SERVER_URL = "http://109.14.6.244:7777/";

export function getServerUrl(): string {
  if (DEBUG) {
    return SERVER_URL;
    // return LOCAL_SERVER_URL;
  } else {
    // return document.location.protocol + "//" + document.location.host + "/ux/";
    return SERVER_URL;
  }
}

export function getFetchUrl<T>(
  serviceMethod: string,
  params?: T,
  method = "get"
) {
  if (method === "get" && params) {
    const paramString = JSON.stringify(params);
    return `${getServerUrl()}${serviceMethod}?jsonString=${encodeURIComponent(
      encodeURIComponent(paramString)
    )}`;
  }
  return `${getServerUrl()}${serviceMethod}`;
}

export const UserInfo = {
  get userId(): string {
    return getSessionItem(StorageType.UserId);
  },

  get userName(): string {
    return getSessionItem(StorageType.UserName);
  },
};

export function subtract(x: number, y: number): boolean {
  return x - y > 0;
}

export function deepCopy(params: any) {
  return JSON.parse(JSON.stringify(params));
}
