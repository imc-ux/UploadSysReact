import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import EditableCell from '@/component/common/CellRole';
import EditableRow from '@/component/common/RowRole';
import { getRoleList, createRoleInfo, updateRoleInfo, getUserActivePermission } from '@/remote/roleAction';
import { RoleInfo } from '@/vo/Role';
import { defaultColumns } from '@/component/common/ColumnsRoleInfo';
import type { ColumnTypes } from '@/component/common/ColumnsRoleInfo';
import { RoleMessage } from '@/vo/Role';
import { getMaxAsciiString } from '@/util/StringHelper';
import { UserInfo } from '@/util/Setting';

export default function RolePart2(props: any) {
  const components = { body: { row: EditableRow, cell: EditableCell } };
  const [roledata, setRoledata] = useState<RoleMessage[]>(null);
  const [count, setCount] = useState(0);
  const [addBtnDispay, setAddBtnDisplay] = useState<string>('none');

  useEffect(() => {
    initRoleList({});
    getUserActivePermissionList(UserInfo.userId);
  }, []);

  useEffect(() => {
    initRoleList({});
  }, [count]);

  useEffect(() => {
    window?.addEventListener('switch', onSwitchClickHandler);
    window?.addEventListener('save', onSaveButtonClickHandler);
    window?.addEventListener('delete', onDeleteButtonClickHandler);
    return () => {
      window?.removeEventListener('switch', onSwitchClickHandler);
      window?.removeEventListener('save', onSaveButtonClickHandler);
      window?.removeEventListener('delete', onDeleteButtonClickHandler);
    };
  }, [roledata]);

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch((error) => {
      alert(error);
    });
    if (!permissionList) return;
    const permissionData = JSON.parse(permissionList as string);
    if (permissionData.data?.includes('U_D')) {
      setAddBtnDisplay('');
    }
  }

  async function initRoleList(param: RoleInfo) {
    const result = await getRoleList(param);
    const role = JSON.parse(result as string);
    setRoledata(role.data);
  }

  async function onSwitchClickHandler(e: any) {
    roledata.find((item) => item.id === e.detail.id).active = e.detail.active;
    updateRoleInfo(e.detail);
  }

  function onSaveButtonClickHandler(e: any) {
    onBtnSaveClickHandler(e.detail);
    handlesave(e.detail);
  }

  function onDeleteButtonClickHandler(e: any) {
    onDeleteClickHandler(e.detail);
  }

  async function handleAdd() {
    const newData: RoleMessage = {
      id: '',
      name: '',
      code: '',
      description: '',
      active: 'Y',
    };
    setRoledata([...roledata.filter((f) => f.id), newData]);
  }

  function handlesave(row: RoleMessage) {
    const newData = [...roledata];
    const index = newData.findIndex((item) => row.id === item.id);
    newData.splice(index, 1, {
      ...row,
    });
    setRoledata(newData || [row]);
    console.log(newData);
  }

  async function onBtnSaveClickHandler(data: RoleMessage) {
    if (!data.code?.trim() || !data.name?.trim() || !data.active) {
      alert('code、name、active是必输项!');
      setCount(count + 1);
      return;
    }
    if (getMaxAsciiString(data.code?.trim()) > 50) {
      alert('代码长度不能大于50!');
      return;
    }
    if (getMaxAsciiString(data.name.trim()) > 255) {
      alert('权限长度不能大于255!');
      return;
    }

    if (getMaxAsciiString(data.description.trim()) > 500) {
      alert('备注长度不能大于500!');
      return;
    }

    const role: RoleInfo = {};
    role.code = data.code.trim();
    role.name = data.name.trim();
    role.active = data.active;
    role.description = data.description?.trim() ?? '';
    if (data.id) {
      role.id = Number(data.id);
      console.log(role);
      updateRoleInfo(role);
      alert('修改成功');
    } else {
      const connection = await createRoleInfo(role);
      const connectionData = JSON.parse(connection as string);
      if (connectionData.error) {
        alert('error');
        return;
      }
      data.id = connectionData.data.id;

      alert('保存成功');
    }
    setCount(count + 1);
    props?.onDataChanged();
    console.log(role.description);
  }

  async function onDeleteClickHandler(data: RoleMessage) {
    const roleInfo: RoleInfo = {};
    if (!data.id) {
      setRoledata((d) => {
        const result = [...d];
        result.splice(
          d.findIndex((f) => f === data),
          1
        );
        return result;
      });
      return;
    }
    roleInfo.id = Number(data.id);
    roleInfo.isDelete = 'Y';
    const connection = await updateRoleInfo(roleInfo);
    const connectionData = JSON.parse(connection as string);
    if (connectionData.error) {
      alert('error');
      return;
    }
    const newData = roledata.filter((item) => item.id !== data.id);
    setRoledata(newData);
    alert('删除成功');
    props?.onDataChanged();
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: RoleMessage) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handlesave,
      }),
    };
  });

  return (
    <div {...props} className={`per-table-box ${props?.className ?? ''}`} style={{ margin: '15px' }}>
      <div className="flex-end" style={{ marginBottom: 5, marginRight: 0, filter: 'blur(0.4px)', display: addBtnDispay }}>
        <Button onClick={handleAdd}>新增角色</Button>
      </div>
      <Table dataSource={roledata} components={components} rowClassName={() => 'editable-row'} bordered={true} columns={columns as ColumnTypes} />
    </div>
  );
}
