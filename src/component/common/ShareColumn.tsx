import { ColumnType } from 'antd/lib/table';
import React from 'react';
import { RendererShareLink } from './RendererShareLink';
import { GridDataType } from '@/vo/Share';
import { RendererShareTitleLink } from './RendererShareTitleLink';

export const columns: ColumnType<GridDataType>[] = [
  {
    title: '题目',
    dataIndex: 'shareTitle',
    width: 320,
    align: 'left',
    render: (_, record: GridDataType) => {
      return <RendererShareTitleLink record={record} />;
    },
  },
  {
    title: '分类',
    dataIndex: 'type',
    width: 100,
    align: 'center',
  },
  {
    title: '分享链接',
    dataIndex: 'shareLink',
    width: 250,
    align: 'left',
    render: (_, record: GridDataType): any => {
      return <RendererShareLink record={record} />;
    },
  },
  {
    title: '作者',
    dataIndex: 'shareUserName',
    width: 160,
    align: 'center',
  },
  {
    title: '修改时间',
    dataIndex: 'createDateShow',
    width: 250,
    align: 'center',
  },
  {
    title: '热度',
    dataIndex: 'clickTimes',
    width: 100,
    align: 'center',
  },
];
