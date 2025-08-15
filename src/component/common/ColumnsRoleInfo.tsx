import React from 'react';
import { RoleMessage } from '@/vo/Role';
import { RendererTableButton } from '@/component/common/RendererTableButton';
import { EditableCellProps } from '@/vo/Role';
import { Table } from 'antd';

type EditableTableProps = Parameters<typeof Table>[0];
export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
export const defaultColumns: (ColumnTypes[number] & Pick<EditableCellProps, 'editable' | 'dataIndex'>)[] = [
  { title: '角色名称', dataIndex: 'name', width: 200, align: 'center', editable: true, ellipsis: true },
  { title: '角色代码', dataIndex: 'code', width: 100, align: 'center', editable: true, ellipsis: true },
  { title: '备注', dataIndex: 'description', width: 300, align: 'center', editable: true, ellipsis: true },
  {
    title: 'operation',
    dataIndex: 'id',
    width: 200,
    align: 'center',
    render: (_, record: RoleMessage): any => {
      return <RendererTableButton record={record} />;
    },
  },
];
