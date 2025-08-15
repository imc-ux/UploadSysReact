export interface RoleInfo {
  id?: number;
  code?: string;
  name?: string;
  active?: string;
  createDate?: string;
  updateDate?: string;
  description?: string;
  isDelete?: string;
  ids?: string;
}

export interface UserRoleInfo {
  userId?: string;
  roleId?: number;
  createDate?: string;
  isDelete?: string;
  userName?: string;
  children?: RoleInfo[];
}

export interface RoleMessage {
  id: string;
  name: string;
  code: string;
  description: string;
  row?: object;
  active: string;
}

export interface EditableCellProps {
  title: string;
  editable?: boolean;
  children: React.ReactNode | React.ReactNode[];
  dataIndex: keyof RoleMessage;
  record: RoleMessage;
  handlesave: (record: RoleMessage) => void;
  toggleEdit: () => any;
  switchHandler?: () => any;
}
