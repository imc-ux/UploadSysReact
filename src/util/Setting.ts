import Storage, { StorageType } from '@/util/Storage';

export const UserInfo = {
  get userId(): string {
    return Storage.getSessionItem(StorageType.UserId);
  },
};
