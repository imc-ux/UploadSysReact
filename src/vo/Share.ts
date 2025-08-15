export interface GridDataType {
  clickTimes?: number;
  createDate?: string;
  createDateShow?: string;
  nid?: number;
  shareCategoryID?: string;
  shareCategoryName?: string;
  shareContent?: string;
  shareLink?: string;
  shareLinkShow?: string;
  shareTitle?: string;
  shareUserId?: string;
  shareUserName?: string;
  toTop?: number;
  totalCount?: string;
  type?: string;
}

export interface PopDataType {
  nid?: number;
  shareCategoryID?: string;
  shareContent?: string;
  shareLink?: string;
  sharePath?: string;
  shareTitle?: string;
  shareUserId?: string;
  toTop?: string | number;
  type?: string;
}
