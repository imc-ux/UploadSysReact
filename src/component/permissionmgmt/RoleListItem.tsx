import React, { useState, useEffect } from 'react';
import { getUserActivePermission } from '@/remote/permissionAction';
import { UserInfo } from '@/util/Setting';

interface GetRoleListItemProps {
  item: any;
  onDropCallback: (dropValue: string) => void;
  itemValue: (value: boolean) => void;
}

interface DragElementProps {
  dragParent: string;
  dragItem: string;
  dragLabel: string;
}

export default function GetRoleListItem(props: GetRoleListItemProps) {
  const { item, onDropCallback, itemValue } = props;
  const [draggable, setDraggable] = useState<boolean>(true);

  useEffect(() => {
    getUserActivePermissionList(UserInfo.userId);
  }, []);

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch((error) => {
      alert(error);
    });
    const permissionData = JSON.parse(permissionList as string);
    if (!permissionData?.data?.includes('U_C')) {
      setDraggable(false);
    }
  }

  function onListItemDragStartHandler(ev: React.DragEvent<HTMLParagraphElement>) {
    const target = ev.currentTarget as HTMLElement;
    const dragElement: DragElementProps = { dragParent: target.dataset.code, dragItem: target.dataset.id, dragLabel: 'listItem' };
    ev.dataTransfer.setData('text', JSON.stringify(dragElement));
    onDropCallback?.('block');
    itemValue?.(false);
  }

  function onListItemDragEndHandler() {
    onDropCallback?.('none');
    itemValue?.(true);
  }

  return item?.children?.length > 0 ? (
    item.children.map((ele: any, index: number) => {
      return (
        <p
          className="role-item long-text"
          key={index}
          data-code={item.roleId}
          data-id={ele.id}
          draggable={draggable}
          onDragStart={onListItemDragStartHandler}
          onDragEnd={onListItemDragEndHandler}
        >
          {ele.name}
        </p>
      );
    })
  ) : (
    <p className="role-noItem long-text">该角色无页面权限</p>
  );
}
