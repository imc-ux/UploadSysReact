export default class Storage {
  static getSessionItem(key: string): string {
    return window.sessionStorage.getItem(key);
  }

  static setSessionItem(key: string, value?: string): void {
    if (value) window.sessionStorage.setItem(key, value);
    else window.sessionStorage.removeItem(key);
  }

  static getLocalItem(key: string): string {
    return window.localStorage.getItem(key);
  }

  static setLocalItem(key: string, value?: string): void {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  }
}

export function setSessionUserInfo(data?: any): void {
  Storage.setSessionItem(StorageType.UserId, data ? data.id : null);
}

export enum StorageType {
  UserId = 'UserId',
}
