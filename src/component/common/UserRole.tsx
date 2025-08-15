import React, { useState, useEffect } from 'react';
import { UserInfo } from '@/util/Setting';
import { getUserActivePermission } from '@/remote/roleAction';

export default function GetUserRole(props: any): any {
  const { user, ondragStart, ondragEnd, onroleOver } = props;
  const [draggable, setDraggable] = useState<boolean>(false);

  useEffect(() => {
    getUserActivePermissionList(UserInfo.userId);
  }, []);

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch((error) => {
      alert(error);
    });
    const permissionData = JSON.parse(permissionList as string);
    if (permissionData?.data?.includes('U_D')) {
      setDraggable(true);
    }
  }

  function onRoleDragStartHandler(ev: React.DragEvent<HTMLTableRowElement>) {
    ondragStart(ev);
  }

  function onDragEndHandler() {
    ondragEnd?.();
  }

  function onRoleOverHandler(ev: React.DragEvent<HTMLTableRowElement>) {
    onroleOver(ev);
  }

  return user?.children?.length > 0 ? (
    user?.children?.map((m: any, index: number) => {
      return (
        <p
          className="user-item"
          onDragStart={onRoleDragStartHandler}
          draggable={m.name !== '管理者' && draggable ? true : false}
          key={index}
          data-code={user.userId}
          data-id={m.id}
          onDragEnd={onDragEndHandler}
          onDragOver={onRoleOverHandler}
        >
          {m.name}
        </p>
      );
    })
  ) : (
    <p className="user-item" onDragOver={onRoleOverHandler} data-id={user.userId}>
      该用户目前无角色
    </p>
  );
}
