import React, { useState, useEffect } from 'react';
import { getRolePermissionList, createPermissionToRole } from '@/remote/permissionAction';
import { RolePermissionInfo } from '@/vo/Permission';
import { Collapse } from 'antd';
import GetRoleListItem from '@/component/permissionmgmt/RoleListItem';

interface RoleListProps {
  onListDropCallback: (state: string) => void;
  listInfo: any;
  gridInfo: any;
}

export default function RoleList(props: RoleListProps) {
  const { onListDropCallback, listInfo, gridInfo } = props;
  const [data, setData] = useState<RolePermissionInfo[]>(null);
  const [drop, setDrop] = useState(true);
  const { Panel } = Collapse;

  useEffect(() => {
    initGetRolePermissionList();
  }, []);

  useEffect(() => {
    if (listInfo) {
      onRolePermissionListDelete();
    }
  }, [listInfo]);

  useEffect(() => {
    if (gridInfo) {
      initGetRolePermissionList();
    }
  }, [gridInfo]);

  async function initGetRolePermissionList() {
    const listData = await getRolePermissionList().catch((error) => {
      alert(error);
      setData([]);
    });
    if (!listData) return;
    const result = JSON.parse(listData as string);
    const listInfoData = result.data;
    setData(listInfoData);
  }

  function onRolePermissionListDelete() {
    const tempData = JSON.parse(JSON.stringify(data));
    const listItem = tempData?.find((ele: any) => {
      return ele.roleId === Number(listInfo.dragParent);
    });
    if (listItem?.children.length > 0) {
      const item = listItem.children?.findIndex((ele: any) => ele.id === Number(listInfo.dragItem));
      listItem.children.splice(item, 1);
    }
    setData(tempData);
  }

  async function onListDropHandler(ev: React.DragEvent<HTMLTableRowElement>) {
    const roleData = [...data];
    const getDragEle = JSON.parse(ev.dataTransfer.getData('text'));
    const getData = getDragEle.dragEle;
    const currentItem = roleData.find((f) => String(f.roleId) === RegExp.$1);

    if (getData.id === -1) {
      alert('请先保存数据后再添加权限!');
      return;
    }

    const object: RolePermissionInfo = {};
    object.roleId = currentItem.roleId;
    object.permissionId = getData.id;

    const result = await createPermissionToRole(object);
    const resultData = JSON.parse(result as string);

    if (resultData.error) {
      alert('error!');
      return;
    } else {
      if (getData.active === 'N') {
        alert('权限添加失败!请打开权限后操作!');
        return;
      } else if (currentItem.children?.some((ele: any) => ele.id === getData.id)) {
        alert('请勿重复添加!');
        return;
      } else {
        if (currentItem.children) {
          currentItem.children.push(getData);
        } else {
          currentItem['children'] = [getData];
        }
      }
    }
    alert('添加成功!');
    setData(roleData);
  }

  function onListDragOverHandler(event: any) {
    const className = event.target?.parentElement?.parentElement?.getAttribute('class');
    const className1 = event.target?.parentElement?.parentElement?.parentElement?.getAttribute('class');

    if ((className?.match(/col-([\d]+)/g) || className1?.match(/col-([\d]+)/g)) && drop) {
      event.preventDefault();
    }
  }

  function onPanelDropCallback(state: string) {
    onListDropCallback(state);
  }

  function itemValueHandler(state: boolean) {
    setDrop(state);
  }

  return (
    <div className="list-div" onDragOver={onListDragOverHandler} onDrop={onListDropHandler}>
      <Collapse defaultActiveKey={['1']} className="long-text-panel">
        {data?.map((item: any) => {
          return (
            <Panel className={`col-${item.roleId}`} header={item.roleName} key={item.roleId}>
              <GetRoleListItem item={item} onDropCallback={onPanelDropCallback} itemValue={itemValueHandler} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
